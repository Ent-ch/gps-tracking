import distance from 'gps-distance';

import db from '../config/db';

let express = require('express'),
    webApp = express(),
    path = require('path');

let today = new Date(),
    startDay = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime() / 1000;

let publFolder = path.join(__dirname, '../', 'public');
webApp.use(express.static(publFolder));

webApp.listen(4000);

webApp.get('/api/stops', (req, res) => {
  let lastCords,
      prevTime,
      prevSpeed,
      prevId,
      prevDevice,
      fistRow,
      prewRow,
      cords = [];


  db('gps_log')
  .orderBy('device, id', 'asc')
  .whereRaw('id > (SELECT max(stop_id) FROM tracks)')
  .map(row => {
    if (prevDevice && row.device !== prevDevice) {
      prevDevice, prevTime = undefined;
      cords = [];
    }
    if (!prevTime) {
      fistRow = row;
    }

    cords.push([row.lat, row.lon]);
    if (prevTime) {
      let dif = new Date(row.created_at) - prevTime;
      if (dif > 90000) {
        let dist = distance(cords);
        if (dist > 0.005) {
          db.table('tracks')
            .returning('id')
            .insert({
              device: prewRow.device,
              start_id: fistRow.id,
              stop_id: prewRow.id,
              start_time: fistRow.created_at,
              stop_time: prewRow.created_at,
              distance: dist,
            })
            .then((newId) => {} );
        }
        cords = [];
        fistRow = row;
      }
    }
    
    prewRow = row;
    prevId = row.id;
    prevTime = new Date(row.created_at);
    prevDevice = row.device;
  })
  .then(() => {
    // res.json(data);
    console.log('Calculated.');
  } )

  res.json([]);
});

webApp.get('/api/last-position', (req, res) => {
  let data = {cords: [0, 0], ts: 0};
  db('gps_log')
  .orderBy('id', 'desc')
  .limit(1)
  .map(row => {
    data.cords[0] = row.lat;
    data.cords[1] = row.lon;
    data.ts = row.created_at;
    data.speed = row.speed;
    res.json(data);
  } )
});

webApp.get('/api/tracks', (req, res) => {
  let data = [];

  db('tracks')
  .orderBy('id', 'desc')
  .map(row => {
    data.push(row);
  })
  .then(() => {
    res.json(data);
  } )
});

webApp.get('/api/track/:id', (req, res) => {
  let data = {cords: [], ts1: 0, ts2: 0};

  db('tracks')
  .where('created_at', '>', startDay)
  .orderBy('id', 'desc')
  .map(row => {
    data.cords.push([row.lat, row.lon]);
  })
  .then(() => {
    res.json(data);
  } )
});

webApp.get('/api/raw-data', (req, res) => {
  let data = [];
  db('raw_log')
  .orderBy('id', 'desc')
  .limit(100)
  .map(row => {
    data.push(row);
  })
  .then(() => {
    res.json(data);
  } )
});

webApp.get('/api/gps-data', (req, res) => {
  let data = [];
  db('gps_log')
  .limit(100)
  .orderBy('id', 'desc')
  .map(row => {
    data.push(row);
  })
  .then(() => {
    res.json(data);
  } )
});
