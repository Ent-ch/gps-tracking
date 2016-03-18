var f = require('firenze');
var Database = f.Database;
var SqliteAdapter = require('firenze-adapter-sqlite3');

var db = new Database({
  adapter: SqliteAdapter,
  filename: 'db/data.db',
  migrations: {
    table: 'z_migrations',
    directory: __dirname + '/migrations',
  }
});

module.exports = db;
