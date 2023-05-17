const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loggin.db');
exports.tracklogin = function(artistID,openAt){
db.serialize(() => {
db.run(`INSERT INTO logs (artistID, open_at) VALUES (?, ?)`, [artistID, openAt], (err) => {
        if (err) {
          console.error('Error inserting login record:', err);
        }
    });
db.all('SELECT DISTINCT artistID FROM logs', function(err, rows){
if(err){
console.log(err);
} else {
console.log("Distinct artists that have been active are: ",rows)
}
});
}
)}
