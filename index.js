var gps = require("gps-tracking");
var db = require('./config/db');
var RawData = require('./models/raw_log').collection,
  GpsData = require('./models/gps_log').collection;

var express = require('express'),
    webApp = express(),
    path = require('path');

var options = {
    'debug': false, //We don't want to debug info automatically. We are going to log everything manually so you can check what happens everywhere
    'port': 8090,
    'device_adapter': "TK103"
  },
  CData = new RawData(),
  GData = new GpsData();

webApp.use(express.static(path.join(__dirname, './public')));

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
  GData.find()
    .limit(500)
    .orderBy('id', 'desc')
    .all()
    .then(function(rows) {
      var data = {cords: [], ts1: 0, ts2: 0};
      rows.forEach(function (row) {
        var lt = parseFloat(row.attributes.latitude),
            ln = parseFloat(row.attributes.longitude);

        console.log(row);

        data.cords.push([lt, ln]);
      });
      res.json(data);
    });
});

webApp.get('/api/raw-data', function(req, res) {
  CData.find()
    .limit(10)
    .orderBy('id', 'desc')
    .all()
    .then(function(models) {
      res.json(models);
    });
});

webApp.get('/api/gps-data', function(req, res) {
  GData.find()
    .orderBy('id', 'desc')
    // .limit(10)
    .all()
    .then(function(models) {
      res.json(models);
    });
});

webApp.listen(4000);


var server = gps.server(options, function(device, connection) {

  device.on("connected", function(data) {
    console.log("I'm a new device connected");
    this.login_authorized(true);
    return data;
  });

  device.on("login_request", function(device_id, msg_parts) {

    console.log('Hey! I want to start transmiting my position. Please accept me. My name is ' + device_id);
    this.login_authorized(true);
    console.log("Ok, " + device_id + ", you're accepted!");
  });

  device.on("ping", function(data) {
    var devId = this.getUID(),
      gdata = GData.model({
        device_id: devId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: Math.floor(Date.now() / 1000)
      });

    gdata.save()
      .catch(function(error) {
        console.log('Could not validated:', error);
      });
    //this = device
    // console.log("I'm here: " + data.latitude + ", " + data.longitude + " (" + this.getUID() + ")");
    //Look what informations the device sends to you (maybe velocity, gas level, etc)
    //console.log(data);
    return data;
  });

  device.on("alarm", function(alarm_code, alarm_data, msg_data) {
    console.log("Help! Something happend: " + alarm_code + " (" + alarm_data.msg + ")");
  });

  //Also, you can listen on the native connection object
  connection.on('data', function(data) {
    var textData = data.toString(),
      sdata = CData.model({
        data: textData,
        ts: Math.floor(Date.now() / 1000)
      });

    sdata.save()
      .then(function(model) {
        // var id = model.get('id');
        // console.log('Created new post with ID:', model);
      })
      .catch(function(error) {
        console.log('Could not validated:', error);
      });
  });

});
