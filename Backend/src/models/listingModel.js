// Purpose of this file:
//
// This file handles all database operations related to the
// listings table.
//
// It is responsible for:
// - Creating a new property listing.
// - Getting all available listings.
// - Getting a listing by its ID.
// - Getting all listings of a specific owner.
// - Updating listing details.
// - Marking a listing as filled.
// - Deleting a listing.

// Import the database connection
const db = require('../config/db');

// Create a new property listing
//
// owner_id          -> Owner who created the listing
// title             -> Title of the property
// description       -> Property description
// location          -> Property location
// rent              -> Monthly rent
// available_from    -> Available date
// room_type         -> Single, Double, etc.
// furnishing_status -> Furnished / Semi-furnished / Unfurnished
async function createListing({
  owner_id,
  title,
  description,
  location,
  rent,
  available_from,
  room_type,
  furnishing_status
}) {

  // Insert a new row into the listings table
  const [result] = await db.query(
    `INSERT INTO listings
    (owner_id, title, description, location, rent, available_from, room_type, furnishing_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      owner_id,
      title,
      description,
      location,
      rent,
      available_from,
      room_type,
      furnishing_status
    ]
  );

  // Return the ID of the newly created listing
  return result.insertId;
}

// Get all available property listings
async function getAllListings() {

  // Fetch only listings whose status is "available"
  // Sort them so the newest listing appears first
  const [rows] = await db.query(
    `SELECT * FROM listings
     WHERE status = 'available'
     ORDER BY created_at DESC`
  );

  return rows;
}

// Get one listing using its ID
async function getListingById(id) {

  // Since ID is unique, only one row will be returned
  const [rows] = await db.query(
    'SELECT * FROM listings WHERE id = ?',
    [id]
  );

  return rows[0];
}

// Get all listings created by one owner
async function getListingsByOwner(owner_id) {

  // Find every listing whose owner_id matches
  const [rows] = await db.query(
    'SELECT * FROM listings WHERE owner_id = ?',
    [owner_id]
  );

  return rows;
}

// Update listing details
async function updateListing(id, fields) {

  // Get all field names that need updating
  // Example:
  // { rent: 12000, location: "Delhi" }
  // keys = ["rent", "location"]
  const keys = Object.keys(fields);

  // Get their values
  // values = [12000, "Delhi"]
  const values = Object.values(fields);

  // Convert field names into:
  // rent = ?, location = ?
  const setClause = keys
    .map((k) => `${k} = ?`)
    .join(', ');

  // Final query becomes:
  // UPDATE listings
  // SET rent = ?, location = ?
  // WHERE id = ?
  await db.query(
    `UPDATE listings SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

// Mark a property as filled
//
// Used when the owner has already rented it out.
async function markListingFilled(id) {

  await db.query(
    `UPDATE listings
     SET status = 'filled'
     WHERE id = ?`,
    [id]
  );
}

// Delete a listing permanently
async function deleteListing(id) {

  await db.query(
    'DELETE FROM listings WHERE id = ?',
    [id]
  );
}

// Export all functions
// Other files can import and use them.
module.exports = {
  createListing,
  getAllListings,
  getListingById,
  getListingsByOwner,
  updateListing,
  markListingFilled,
  deleteListing,
};