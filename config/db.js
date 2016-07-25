var f = require('firenze');
var SqliteAdapter = require('firenze-adapter-sqlite3');
var config = require('./config');

var Database = f.Database;

var db = new Database({
  adapter: SqliteAdapter,
  filename: config.sqlite.database,
  migrations: {
    table: 'z_migrations',
    directory: __dirname + '/migrations',
  }
});

module.exports = db;
