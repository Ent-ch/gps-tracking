var db = require('../config/db');

module.exports.schema = {
    id: {
      type: 'increments',
      primary: true
    },
    latitude: {
      type: 'string',
      length: 15
    },
    longitude: {
      type: 'string',
      length: 15
    },
    timestamp: {
      type: 'timestamp',
    }
};

module.exports.collection = db.createCollection({
  table: 'gps_log',
  alias: 'GpsLog',
  schema: module.exports.schema
});
