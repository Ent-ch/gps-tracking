import RawModel from '../models/raw_log';
import GpsModel from '../models/gps_log';
import distance from 'gps-distance';


let express = require('express'),
    webApp = express(),
    path = require('path'),
    RawData = RawModel.collection,
    GpsData = GpsModel.collection,
    CData = new RawData(),
    GData = new GpsData();

let today = new Date(),
    startDay = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime() / 1000;

let publFolder = path.join(__dirname, '../', 'public');
webApp.use(express.static(publFolder));

webApp.listen(4000);

webApp.get('/api/stops', (req, res) => {
  let lastCords,
      nowCords,
      result,
      stop = [],
      stops = [],
      filterStops = [],
      cords = [];

  GData.find()
    // .limit(400)
    .where((expr) => expr.gt('timestamp', startDay))
    .orderBy('id', 'asc')
    .all()
    .then((rows) => {
      rows.forEach((row) => {

        nowCords = [parseFloat(row.attributes.latitude), parseFloat(row.attributes.longitude), row.attributes.timestamp, row.attributes.id];
        lastCords = cords.pop();

        if (lastCords && distance([lastCords, nowCords]) < 0.005) {
          if (!stop.length) {
            stop.push(lastCords);
          }
          stop.push(nowCords);
        } else {
          if (stop.length) {
            stops.push(stop);
            stop = [];
          }
        }
        cords.push(nowCords);
      });

      stops.forEach((elem) => {
        let dur = (elem[elem.length - 1][2] - elem[0][2]);
        if (dur >= 60) {
          filterStops.push([elem[0], dur]);
        }
      });
      res.json(filterStops);
    });
});

webApp.get('/api/last-position', (req, res) => {
  GData.find()
    .orderBy('id', 'desc')
    .first()
    .then((models) => {
      let data = {cords: [0, 0], ts: 0};
      if (models) {
        data.cords[0] = parseFloat(models.get('latitude'));
        data.cords[1] = parseFloat(models.get('longitude'));
        data.ts = models.get('timestamp');
      }
      res.json(data);
    });
});

webApp.get('/api/track', (req, res) => {
  GData.find()
    .where((expr) => expr.gt('timestamp', startDay)
        // .isNotNull('title')
    )
    .orderBy('id', 'desc')
    .all()
    .then((rows) => {
      let data = {cords: [], ts1: 0, ts2: 0};
      rows.forEach((row) => {
        let lt = parseFloat(row.attributes.latitude),
            ln = parseFloat(row.attributes.longitude);

        data.cords.push([lt, ln]);
      });
      res.json(data);
    });
});

webApp.get('/api/raw-data', (req, res) => {
  CData.find()
    .limit(100)
    .orderBy('id', 'desc')
    .all()
    .then((models) => res.json(models));
});

webApp.get('/api/gps-data', (req, res) => {
  GData.find()
    .orderBy('id', 'desc')
    .limit(500)
    .all()
    .then((models) => res.json(models));
});
