var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('example.db');
db.run("PRAGMA foreign_keys = ON;"); //enables foreign keys in sqlite3

// Seed data for the logs table
const logsData = [
  { userID: 'user1', open_at: '2023-01-01' },
  { userID: 'user2', open_at: '2023-01-02' },
  { userID: 'user3', open_at: '2023-01-03' },
];

// Insert seed data into the logs table
db.serialize(() => {
  // Drop the logs table if it exists
  db.run('DROP TABLE IF EXISTS logs');

  // Create the logs table
  db.run(`CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID TEXT,
    open_at DATE DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert seed data into the logs table
  logsData.forEach((log) => {
    db.run(`INSERT INTO logs (userID, open_at) VALUES (?, ?)`, [log.userID, log.open_at]);
  });
});

// Close the database connection
db.close();
