import gps from 'gps-tracking';

import db from '../config/db';

let options = {
    'debug': false,
    'port': 8090,
    'device_adapter': "TK103",
  };
  

let server = gps.server(options, function(device, connection) {

  device.on("connected", function(data) {
    let d = new Date();
    console.log("New device connected at ", data, d);
    this.login_authorized(true);
    return data;
  });

  device.on("login_request", function(device_id, msg_parts) {
    console.log('Device auth: ' + device_id);
    this.login_authorized(true);
    console.log("Ok, " + device_id + ", you're accepted!");
  });

  device.on("ping", function(data) {

    db.table('gps_log')
      .returning('id')
      .insert({
        device: this.getUID(),
        lat: data.latitude,
        lon: data.longitude,
        speed: data.speed,
        orientation: data.orientation,
        mileage: data.mileage,
        data: JSON.stringify(data),
      })
      .then((newId) => {} );

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

    db.table('raw_log')
      .returning('id')
      .insert({log: data.toString()})
      .then((newId) => {} );

  });

});
