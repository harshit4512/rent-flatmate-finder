// ===============================================
// Purpose of this file
// ===============================================
//
// This file is responsible for interacting with the
// interest_requests table in the MySQL database.
//
// It contains functions to:
// 1. Create a new interest request.
// 2. Get all requests for a property listing.
// 3. Get all requests made by a tenant.
// 4. Update the status of a request.
// 5. Get one request using its ID.
//
// This file only performs database operations.
// It does NOT contain business logic or API routes.
//

// Import the database connection (promise pool)
const db = require('../config/db');

// ======================================================
// Create a new interest request
// ======================================================
//
// When a tenant clicks "I'm Interested" on a property,
// a new row is inserted into the interest_requests table.
//
// Parameters:
// tenant_id  -> ID of the tenant
// listing_id -> ID of the property listing
//
async function createInterestRequest(tenant_id, listing_id) {

  // Execute INSERT query
  const [result] = await db.query(

    // Create a new request.
    // By default its status will be "Pending".
    `INSERT INTO interest_requests (tenant_id, listing_id, status)
     VALUES (?, ?, 'Pending')`,

    // Replace placeholders (?) with actual values
    [tenant_id, listing_id]
  );

  // Return the ID of the newly created request
  return result.insertId;
}

// ======================================================
// Get all interest requests for one listing
// ======================================================
//
// Used when an owner wants to see everyone
// who has shown interest in their property.
//
async function getInterestsByListing(listing_id) {

  // Fetch all requests having this listing_id
  const [rows] = await db.query(
    'SELECT * FROM interest_requests WHERE listing_id = ?',

    // Replace placeholder
    [listing_id]
  );

  // Return all matching rows
  return rows;
}

// ======================================================
// Get all requests made by one tenant
// ======================================================
//
// Used when a tenant wants to view all
// the properties they have shown interest in.
//
async function getInterestsByTenant(tenant_id) {

  // Fetch all requests of this tenant
  const [rows] = await db.query(
    'SELECT * FROM interest_requests WHERE tenant_id = ?',

    // Replace placeholder
    [tenant_id]
  );

  // Return all matching rows
  return rows;
}

// ======================================================
// Update request status
// ======================================================
//
// Used when the owner changes the request status.
//
// Example:
// Pending -> Accepted
// Pending -> Rejected
//
async function updateInterestStatus(id, status) {

  // Update the status of the request
  await db.query(
    'UPDATE interest_requests SET status = ? WHERE id = ?',

    // Replace placeholders
    [status, id]
  );

  // No return value because we only update the row.
}

// ======================================================
// Get one interest request by its ID
// ======================================================
//
// Used when we need details of one specific request.
//
async function getInterestById(id) {

  // Fetch request having this ID
  const [rows] = await db.query(
    'SELECT * FROM interest_requests WHERE id = ?',

    // Replace placeholder
    [id]
  );

  // rows is an array.
  // Since ID is unique, return only the first row.
  return rows[0];
}

// ======================================================
// Export all functions
// ======================================================
//
// Other files (controllers/services) can import these
// functions and use them to interact with the database.
//
module.exports = {
  createInterestRequest,
  getInterestsByListing,
  getInterestsByTenant,
  updateInterestStatus,
  getInterestById,
};