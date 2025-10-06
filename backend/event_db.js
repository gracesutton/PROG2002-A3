const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'verysecurepassword',
  database: 'charityevents_db',
  port: 3306
});

// connect to database
connection.connect((err) => {
  if (err) throw err;
  console.log('Database connection successful');
});

module.exports = connection;