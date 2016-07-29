import distance from 'gps-distance';

import db from '../config/db';

const MIN_SKIP_DISTANSE = 0.005 //km
const MAX_SKIP_TIME = 90000 //ms 
const MIN_SKIP_TIME = 3000 //ms 

export function calcTracks() {
  let lastCords,
      prevTime,
      fistRow,
      prevRow,
      cords = [];

  db('gps_log')
  .orderBy('device, id', 'asc')
//   .whereRaw('id > CONVERT(INT, (SELECT MAX(stop_id) FROM stops))')
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

