// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',         // Or your DB host
  user: 'root',              // Your MySQL username
  password: 'Sriram@4', // Replace with your password
  database: 'amazon'  // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database.');
});

module.exports = db;
