import db from '../config/db';
import * as calcData from './calc.data';
import { bearing } from './gps.utils';

let express = require('express'),
    webApp = express(),
    path = require('path');

let today = new Date(),
    startDay = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime() / 1000;

let publFolder = path.join(__dirname, '../', 'public');
webApp.use(express.static(publFolder));

webApp.listen(4000);


webApp.get('/api/stops', (req, res) => {
  let data = {};

  db('stops')
  .orderBy('id', 'desc')
  .then((rows) => {
    // console.log(rows);
    res.json(rows);
  } );
});
  
webApp.get('/api/calc', (req, res) => {
  calcData.calcAll();
  res.send({});
});

webApp.get('/api/last-position', (req, res) => {
  let lastData, data = {lat: 0, lon: 0, orientation: 0};
  db('gps_log')
  .orderBy('id', 'desc')
  .limit(2)
  .map((row, i) => {
    if (i === 0) {
      lastData = row;
      return;
    }
    data = lastData;
    data.orientation = bearing(row.lat, row.lon, lastData.lat, lastData.lon);
  })
  .then(() => {
    res.json(data);
  });
});

webApp.get('/api/devices', (req, res) => {
  let data = [];

  db('gps_log')
  .groupBy('device')
  // .max('created_at')
  .orderBy('id', 'desc')
  .map(row => {
    data.push(row);
  })
  .then(() => {
    res.json(data);
  } );
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
  } );
});

webApp.get('/api/tracks/:id', (req, res) => {
  let data = [],
    trk, trkData = [];

  db('tracks')
  .where('id', '=', parseInt(req.params.id))
  .orderBy('id', 'desc')
  .map(row => {
    trk = row;
  })
  .then(() => {

    db('gps_log')
    .where('device', '=', trk.device)
    .andWhere('id', '>=', trk.start_id)
    .andWhere('id', '<=', trk.stop_id)
    .orderBy('id', 'asc')
    .map(row => {
      data.push([row.lat, row.lon]);
    })
    .then(() => {
      res.json(data);
    });
  });
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
