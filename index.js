var db = require('./config/db');
var fs = require('fs');

fs.readdirSync('./controllers').forEach(function (file) {
  var outMod = require('./controllers/' + file);
  console.log('Load controllers from - ' + file);
});
