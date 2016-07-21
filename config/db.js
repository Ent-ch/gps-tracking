var f = require('firenze');
var SqliteAdapter = require('firenze-adapter-sqlite3');

var Database = f.Database;

var db = new Database({
  adapter: SqliteAdapter,
  filename: 'db/data.db',
  migrations: {
    table: 'z_migrations',
    directory: __dirname + '/migrations',
  }
});

module.exports = db;
