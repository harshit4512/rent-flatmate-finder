// Import the mysql2 library to connect Node.js with a MySQL database.
const mysql = require('mysql2');

// Load environment variables from the .env file into process.env.
require('dotenv').config();

// Create a connection pool.
// A pool maintains multiple database connections so they can be reused
// instead of creating a new connection for every query.
const pool = mysql.createPool({

  // Database server address (e.g., localhost)
  host: process.env.DB_HOST,

  // MySQL username
  user: process.env.DB_USER,

  // MySQL password
  password: process.env.DB_PASSWORD,

  // Name of the database to connect to
  database: process.env.DB_NAME,

  // If all connections are busy, wait instead of throwing an error.
  waitForConnections: true,

  // Maximum number of active database connections.
  connectionLimit: 10,
});

// Convert the callback-based pool into a Promise-based pool.
// This allows us to use async/await instead of callbacks.
const promisePool = pool.promise();

// Export the Promise pool so it can be imported and used
// anywhere in the project for executing SQL queries.
module.exports = promisePool;