var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "db/data.db"
  },
  migrations: {
    tableName: 'migrations'
  },
  useNullAsDefault: true  
});


knex.schema.createTableIfNotExists('raw_log', function (table) {
  table.increments('id');
  table.text('log');
  table.timestamp('created_at').defaultTo(knex.fn.now());
})
.createTableIfNotExists('gps_log', function(table) {
  table.increments('id');
  table.string('device');
  table.float('lon');
  table.float('lat');
  table.float('speed');
  table.float('orientation');
  table.float('mileage');
  table.text('data');
  table.timestamp('created_at').defaultTo(knex.fn.now());
  // table.index('device');
})
.catch(function(e) {
  console.error(e);
});


module.exports = knex;
