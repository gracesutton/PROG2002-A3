const mysql = require('mysql2');

const connection = mysql.createPool({
  host: '127.0.0.1',    
  port: 3306,
  user: 'root',
  password: '23924073',  
  database: 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// optional startup probe
connection.query('SELECT 1', (err) => {
  console.log(err ? 'DB connect failed: ' + err.message : 'Database connection successful');
});

module.exports = connection;