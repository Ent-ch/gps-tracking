var db = require('./config/db');
var fs = require('fs');

var colors  = require('colors')
var traceur = require('traceur')
require('traceur-source-maps').install(traceur);

traceur.require.makeDefault(function (filePath) {
  return !~filePath.indexOf('node_modules');
});

fs.readdirSync('./controllers').forEach(function (file) {
  var outMod = require('./controllers/' + file);
  console.log('Load controllers from - ' + file);
});
