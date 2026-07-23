// Purpose of this file:
//
// This file handles all database operations related to the
// tenant_profiles table.
//
// It is responsible for:
// - Creating a tenant profile.
// - Getting a tenant profile using the user's ID.
// - Updating an existing tenant profile.

// Import the database connection
const db = require('../config/db');

// Create a new tenant profile
//
// user_id             -> User who owns this profile
// preferred_location  -> Preferred area to rent in
// budget_min          -> Minimum budget
// budget_max          -> Maximum budget
// move_in_date        -> Expected move-in date
// occupation          -> Tenant's occupation
// gender_preference   -> Preferred gender of roommates/owner (if applicable)
async function createTenantProfile({
  user_id,
  preferred_location,
  budget_min,
  budget_max,
  move_in_date,
  occupation,
  gender_preference
}) {

  // Insert a new tenant profile into the database
  const [result] = await db.query(
    `INSERT INTO tenant_profiles
    (user_id, preferred_location, budget_min, budget_max, move_in_date, occupation, gender_preference)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      preferred_location,
      budget_min,
      budget_max,
      move_in_date,
      occupation,
      gender_preference
    ]
  );

  // Return the ID of the newly created profile
  return result.insertId;
}

// Get the tenant profile of a specific user
async function getTenantProfileByUserId(user_id) {

  // Find the profile whose user_id matches
  const [rows] = await db.query(
    'SELECT * FROM tenant_profiles WHERE user_id = ?',
    [user_id]
  );

  // Since one user has only one tenant profile,
  // return the first row.
  return rows[0];
}

// Update an existing tenant profile
async function updateTenantProfile(user_id, fields) {

  // Get all field names that need updating.
  // Example:
  // { budget_max: 15000, occupation: "Student" }
  //
  // keys = ["budget_max", "occupation"]
  const keys = Object.keys(fields);

  // Get all corresponding values.
  //
  // values = [15000, "Student"]
  const values = Object.values(fields);

  // Convert field names into SQL format.
  //
  // Example:
  // ["budget_max", "occupation"]
  //
  // becomes:
  // "budget_max = ?, occupation = ?"
  const setClause = keys
    .map((k) => `${k} = ?`)
    .join(', ');

  // Final query becomes something like:
  //
  // UPDATE tenant_profiles
  // SET budget_max = ?, occupation = ?
  // WHERE user_id = ?
  await db.query(
    `UPDATE tenant_profiles
     SET ${setClause}
     WHERE user_id = ?`,
    [...values, user_id]
  );

  // Spread operator (...) adds all values first
  // and then appends user_id at the end.
  //
  // Example:
  // values = [15000, "Student"]
  //
  // becomes:
  // [15000, "Student", user_id]
}

// Export all functions
// Other files (controllers/services) can import and use them.
module.exports = {
  createTenantProfile,
  getTenantProfileByUserId,
  updateTenantProfile
};