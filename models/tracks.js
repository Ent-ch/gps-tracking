var db = require('../config/db');

let schema = {
    id: {
      type: 'increments',
      primary: true
    },
    device_id: {
      type: 'string',
      length: 15
    },
    start_id: {
      type: 'integer'
    },
    stop_id: {
      type: 'integer'
    },
    duration: {
      type: 'integer'
    },
    length: {
      type: 'integer'
    },
};

let collection = db.createCollection({
  table: 'tracks',
  alias: 'Tracks',
  schema,
});

module.exports = {schema, collection};