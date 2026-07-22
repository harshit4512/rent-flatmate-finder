// Purpose of this file:
//
// This file handles all database operations related to the
// users table.
//
// It is responsible for:
// - Creating a new user.
// - Finding a user using email.
// - Finding a user using ID.
// - Getting all users.
// - Deleting a user.

// Import the database connection
const db = require('../config/db');

// Create a new user
//
// name     -> User's name
// email    -> User's email
// password -> Hashed password
// phone    -> User's phone number
// role     -> owner / tenant / admin
async function createUser({ name, email, password, phone, role }) {

  // Insert a new user into the users table
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, phone, role]
  );

  // Return the ID of the newly created user
  return result.insertId;
}

// Find a user using email
//
// Mostly used during login to check
// whether the email already exists.
async function findUserByEmail(email) {

  // Search for a user having the given email
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  // Email is unique, so only one user will exist.
  return rows[0];
}

// Find a user using their ID
async function findUserById(id) {

  // Fetch only the required columns.
  // Password is not selected because
  // we don't need to send it to the client.
  const [rows] = await db.query(
    `SELECT id, name, email, phone, role, created_at
     FROM users
     WHERE id = ?`,
    [id]
  );

  // Return the user object
  return rows[0];
}

// Get all users
async function getAllUsers() {

  // Fetch all users.
  // ORDER BY created_at DESC means
  // newest registered users appear first.
  const [rows] = await db.query(
    `SELECT id, name, email, phone, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return rows;
}

// Delete a user
async function deleteUser(id) {

  // Remove the user whose ID matches
  await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  // Nothing is returned because the row is simply deleted.
}

// Export all functions
// Other files (controllers/services) can import and use them.
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  deleteUser
};