var Promise = require('firenze').Promise;
var schemaRaw = require('../../models/raw_log').schema,
  schemaGps = require('../../models/gps_log').schema;

module.exports = {
  before: function(db, direction) {
    return new Promise.resolve(true);
  },

  up: function(db) {
    db.schema()
      .createTable('z_migrations', {
        created: {
          type: 'timestamp',
        },
        id: {
          type: 'string',
          length: 100
        }
      });

    db.schema().createTable('raw_log', schemaRaw);
    db.schema().createTable('gps_log', schemaGps);

    return new Promise.resolve(true);
  },

  down: function(db) {
    return db.schema()
      .dropTable('raw_log');
  },

  after: function(db, direction) {
    return new Promise.resolve(true);
  }
};
