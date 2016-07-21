var db = require('../config/db');

let schema = {
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
    },
};

let collection = db.createCollection({
  table: 'raw_log',
  alias: 'RawLog',
  schema,
});

module.exports = {schema, collection};
