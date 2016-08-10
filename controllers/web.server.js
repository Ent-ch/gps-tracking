import db from '../config/db';
import * as calcData from './calc.data';

let express = require('express'),
    webApp = express(),
    path = require('path');

let today = new Date(),
    startDay = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime() / 1000;

let publFolder = path.join(__dirname, '../', 'public');
webApp.use(express.static(publFolder));

webApp.listen(4000);


webApp.get('/api/stops', (req, res) => {
  res.json([]);
});
  
webApp.get('/api/calc', (req, res) => {
  calcData.calcAll();
  res.send({});
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
