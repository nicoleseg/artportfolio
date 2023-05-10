var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('example.db');

db.run("PRAGMA foreign_keys = ON;"); //enables foreign keys in sqlite3

db.run("INSERT INTO logs (userID,open_at) VALUES (?), (?)",
  'Mrs. Smith',
  'Mr. Wilson',
  function(err) {
    if (err) { throw err;}
  }
);
