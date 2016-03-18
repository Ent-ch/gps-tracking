var gps = require("gps-tracking");
var db = require('./config/db');
var RawData = require('./models/raw_log').collection,
  GpsData = require('./models/gps_log').collection;
var express = require('express');
var webApp = express();

var options = {
    'debug': false, //We don't want to debug info automatically. We are going to log everything manually so you can check what happens everywhere
    'port': 8090,
    'device_adapter': "TK103"
  },
  CData = new RawData(),
  GData = new GpsData();

webApp.get('/', function(req, res) {
  res.send('hello user');
});

webApp.get('/raw-data', function(req, res) {
  CData.find()
    .orderBy('id', 'desc')
    .all()
    .then(function(models) {
      res.json(models);
    });
});

webApp.get('/gps-data', function(req, res) {
  GData.find()
    .orderBy('id', 'desc')
    .all()
    .then(function(models) {
      res.json(models);
    });
});

webApp.listen(4000);


var server = gps.server(options, function(device, connection) {

  device.on("connected", function(data) {
    console.log("I'm a new device connected");
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
