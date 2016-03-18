var db = require('../config/db');

module.exports.schema = {
    id: {
      type: 'increments',
      primary: true
    },
    data: {
      type: 'string',
      length: 255
    },
    ts: {
      type: 'timestamp',
    }
};

module.exports.collection = db.createCollection({
  table: 'raw_log',
  alias: 'RawLog',
  schema: module.exports.schema
});
