// ===============================================
// Purpose of this file
// ===============================================
//
// This file is responsible for interacting with the
// compatibility_scores table in the MySQL database.
//
// It contains functions to:
// 1. Save or update a compatibility score.
// 2. Get the score of one tenant for one listing.
// 3. Get all compatibility scores of a tenant.
//
// This file only talks to the database.
// It does NOT contain business logic or API routes.
//

// Import the database connection (promise pool)
const db = require('../config/db');

// ======================================================
// Save a compatibility score
// ======================================================
//
// If a score for the same tenant and listing already exists,
// MySQL updates it instead of creating a new row.
//
// Parameters:
// tenant_id     -> Tenant's ID
// listing_id    -> Property listing ID
// score         -> Compatibility score
// explanation   -> AI explanation
// generated_by  -> Who generated the score (AI/manual)
//
async function saveScore({ tenant_id, listing_id, score, explanation, generated_by }) {

  // Execute SQL query
  const [result] = await db.query(

    // Insert a new compatibility score
    // If the row already exists (duplicate),
    // update the score and explanation.
    `INSERT INTO compatibility_scores (tenant_id, listing_id, score, explanation, generated_by)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        explanation = VALUES(explanation),
        generated_by = VALUES(generated_by)`,

    // Replace ? placeholders with actual values
    [tenant_id, listing_id, score, explanation, generated_by]
  );

  // Return ID of inserted row
  // (If updated, insertId may not be useful.)
  return result.insertId;
}

// ======================================================
// Get compatibility score for one tenant and one listing
// ======================================================
async function getScore(tenant_id, listing_id) {

  // Find matching row
  const [rows] = await db.query(

    // Select all columns
    'SELECT * FROM compatibility_scores WHERE tenant_id = ? AND listing_id = ?',

    // Replace placeholders
    [tenant_id, listing_id]
  );

  // rows is an array
  // Since tenant_id + listing_id should be unique,
  // return only the first matching row.
  return rows[0];
}

// ======================================================
// Get all compatibility scores of one tenant
// ======================================================
async function getScoresForTenant(tenant_id) {

  // Fetch every compatibility score
  const [rows] = await db.query(

    // Sort by highest score first
    'SELECT * FROM compatibility_scores WHERE tenant_id = ? ORDER BY score DESC',

    // Replace placeholder
    [tenant_id]
  );

  // Return all matching rows
  return rows;
}

// Export all database functions
// Other files can import and use them.
module.exports = {
  saveScore,
  getScore,
  getScoresForTenant
};