var Promise = require('firenze').Promise;

var schemaStops = require('../../models/stops').schema,
  schemaTracks = require('../../models/tracks').schema;

module.exports = {
  before: function (db, direction) {
    return new Promise.resolve(true);
  },

  up: function (db) {
    db.schema().createTable('stops', schemaStops);
    db.schema().createTable('tracks', schemaTracks);

    return new Promise.resolve(true);
  },

  down: function (db) {
    db.schema().dropTable('stops');
    db.schema().dropTable('tracks');

    return new Promise.resolve(true);
  },

  after: function (db, direction) {
    return new Promise.resolve(true);
  }
};
