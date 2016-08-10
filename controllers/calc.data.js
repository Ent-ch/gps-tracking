import distance from 'gps-distance';

import db from '../config/db';

const MIN_SKIP_DISTANSE = 0.005 //km
const MAX_SKIP_TIME = 90000 //ms 
const MIN_SKIP_TIME = 30000 //ms 

function calcTracks(maxId = 0) {
  let lastCords,
      prevTime,
      fistRow,
      prevRow,
      cords = [];

  db('gps_log')
  .orderBy('device, id', 'asc')
  .where('id', '>', maxId)
  .map(row => {
    if (prevRow && row.device !== prevRow.device) {
      prevTime = undefined;
      cords = [];
    }
    if (!prevTime) {
      fistRow = row;
    }
    cords.push([row.lat, row.lon]);
    if (prevTime) {
      let dif = new Date(row.created_at) - prevTime;
      if (dif > MAX_SKIP_TIME) {
        let dist = distance(cords);
        if (dist > MIN_SKIP_DISTANSE) {
          db.table('tracks')
            .returning('id')
            .insert({
              device: prevRow.device,
              start_id: fistRow.id,
              stop_id: prevRow.id,
              start_time: fistRow.created_at,
              stop_time: prevRow.created_at,
              distance: dist,
            })
            .then((newId) => {} );
        }
        cords = [];
        fistRow = row;
      }
    }
    prevRow = row;
    prevTime = new Date(row.created_at);
  })
  .then(() => {
    console.log('Calculated tracks.');
  } )
}

function calcStops(maxId = 0) {
  let lastCords,
      prevTime,
      fistRow,
      prevRow,
      cords = [],
      echo = '';

  db('gps_log')
  .orderBy('device, id', 'asc')
  .where('id', '>', maxId)
  .map(row => {
    if (prevRow && row.device !== prevRow.device) {
      prevTime = undefined;
      cords = [];
    }
    if (!prevTime) {
      fistRow = row;
    }

    if (prevTime) {
      let dif = new Date(row.created_at) - prevTime;
      if (dif > MIN_SKIP_TIME) {
        cords.push([row.lat, row.lon]);
        let dist = distance(cords);
        echo += `curr dist = ${dist} <br>`;
        if (dist > MIN_SKIP_DISTANSE) {
          echo += `< MIN_SKIP_DISTANSE dist = ${dist} <br> ${JSON.stringify(fistRow)} <br> ${JSON.stringify(prevRow)}`;
          db.table('stops')
            .returning('id')
            .insert({
              device: prevRow.device,
              start_id: fistRow.id,
              stop_id: prevRow.id,
              start_time: fistRow.created_at,
              stop_time: prevRow.created_at,
            })
            .then((newId) => {} );

          cords = [];
          fistRow = row;
        }
      }
    }
    prevRow = row;
    prevTime = new Date(row.created_at);
  })
  .then(() => {
    console.log('Calculated stops.');
    // return echo;
  } )
}

export function calcAll() {
  let maxId = 0;

  db.from('stops')
  .max('stop_id')
  .then((rows) => {
    for (let col in rows[0]) {
      maxId = rows[0][col] !== null ? rows[0][col] : 0;
    }
    console.log(maxId);
    calcStops(maxId);
  });

  db.from('tracks')
  .max('stop_id')
  .then((rows) => {
    for (let col in rows[0]) {
      maxId = rows[0][col] !== null ? rows[0][col] : 0;
    }
    console.log(maxId);
    calcTracks(maxId);
  });
}

setInterval(() => calcAll(), 300000);
