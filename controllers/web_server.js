var express = require('express'),
    webApp = express(),
    path = require('path'),
    RawData = require('../models/raw_log').collection,
    GpsData = require('../models/gps_log').collection,
    CData = new RawData(),
    GData = new GpsData();

webApp.use(express.static(path.join(__dirname, './public')));

webApp.listen(4000);

webApp.get('/api/last-position', function(req, res) {
  GData.find()
    .orderBy('id', 'desc')
    .first()
    .then(function(models) {
      var data = {cords: [0, 0], ts: 0};
      if (models) {
        data.cords[0] = parseFloat(models.get('latitude'));
        data.cords[1] = parseFloat(models.get('longitude'));
        data.ts = models.get('timestamp');
      }
      res.json(data);
    });
});

webApp.get('/api/track', function(req, res) {
  var today = new Date(),
      startDay = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).getTime() / 1000;

  GData.find()
    .where(function (expr) {
      expr
        .gt('timestamp', startDay);
        // .isNotNull('title')
    })
    .orderBy('id', 'desc')
    .all()
    .then(function(rows) {
      var data = {cords: [], ts1: 0, ts2: 0};
      rows.forEach(function (row) {
        var lt = parseFloat(row.attributes.latitude),
            ln = parseFloat(row.attributes.longitude);

        data.cords.push([lt, ln]);
      });
      res.json(data);
    });
});

webApp.get('/api/raw-data', function(req, res) {
  CData.find()
    .limit(100)
    .orderBy('id', 'desc')
    .all()
    .then(function(models) {
      res.json(models);
    });
});

webApp.get('/api/gps-data', function(req, res) {
  GData.find()
    .orderBy('id', 'desc')
    .limit(500)
    .all()
    .then(function(models) {
      res.json(models);
    });
});
