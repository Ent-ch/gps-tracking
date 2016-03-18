var Promise = require('firenze').Promise;
var schema = require('../../models/raw_log').schema;

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

    db.schema()
      .createTable('raw_log', schema);

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
