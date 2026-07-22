// Purpose of this file:
//
// This file handles all database operations related to the
// messages table.
//
// It is responsible for:
// - Saving a new chat message.
// - Fetching the conversation between two users for a specific listing.

// Import the database connection
const db = require('../config/db');

// Save a new message in the database
//
// sender_id   -> User sending the message
// receiver_id -> User receiving the message
// listing_id  -> Property about which the users are chatting
// message     -> Actual message text
async function createMessage({ sender_id, receiver_id, listing_id, message }) {

  // Insert a new message into the messages table
  const [result] = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, listing_id, message)
     VALUES (?, ?, ?, ?)`,
    [sender_id, receiver_id, listing_id, message]
  );

  // Return the ID of the newly created message
  return result.insertId;
}

// Get all chat messages between two users
// for a particular property listing.
async function getMessagesForListing(listing_id, user1_id, user2_id) {

  const [rows] = await db.query(

    // Select all messages where:
    // - The listing is the given listing.
    // - User1 sent to User2 OR User2 sent to User1.
    // This gives the complete conversation between both users.
    //
    // Example:
    // User1 -> User2 ✅
    // User2 -> User1 ✅
    // Other users ❌
    //
    // ORDER BY created_at ASC
    // ASC (Ascending) means oldest message first,
    // newest message last, just like a normal chat.
    `SELECT * FROM messages
     WHERE listing_id = ?
     AND ((sender_id = ? AND receiver_id = ?)
     OR (sender_id = ? AND receiver_id = ?))
     ORDER BY created_at ASC`,

    // Replace all ? placeholders
    [
      listing_id,
      user1_id,
      user2_id,
      user2_id,
      user1_id
    ]
  );

  // Return the complete conversation
  return rows;
}

// Export all functions
// Other files (controllers/services) can use them.
module.exports = {
  createMessage,
  getMessagesForListing
};