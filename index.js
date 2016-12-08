/* eslint-disable */

var db = require('./server/config/db');
var fs = require('fs');

var colors  = require('colors')
var traceur = require('traceur')
require('traceur-source-maps').install(traceur);

traceur.require.makeDefault(function (filePath) {
  return !~filePath.indexOf('node_modules');
});

fs.readdirSync('./server/controllers').forEach(function (file) {
  var outMod = require('./server/controllers/' + file);
  console.log('Load controllers from - ' + file);
});
