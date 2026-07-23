// Purpose of this file:
//
// This file handles all database operations related to the
// notifications table.
//
// It is responsible for:
// - Creating a new notification.
// - Getting all notifications of a user.
// - Marking a notification as read.

// Import the database connection
const db = require('../config/db');

// Create a new notification
//
// user_id -> User who will receive the notification
// title   -> Short heading of the notification
// message -> Detailed notification message
async function createNotification({ user_id, title, message }) {

  // Insert a new notification into the notifications table
  const [result] = await db.query(
    `INSERT INTO notifications (user_id, title, message)
     VALUES (?, ?, ?)`,
    [user_id, title, message]
  );

  // Return the ID of the newly created notification
  return result.insertId;
}

// Get all notifications of a specific user
async function getNotificationsForUser(user_id) {

  // Fetch notifications belonging to the given user.
  // ORDER BY created_at DESC means:
  // Newest notification appears first.
  const [rows] = await db.query(
    `SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [user_id]
  );

  // Return all notifications
  return rows;
}

// Mark a notification as read
//
// When a user opens or views a notification,
// its is_read field becomes TRUE.
async function markAsRead(id) {

  // Update only the notification having this ID
  await db.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = ?',
    [id]
  );

  // Nothing is returned because we are only updating the row.
}

// Export all functions
// Other files (controllers/services) can import and use them.
module.exports = {
  createNotification,
  getNotificationsForUser,
  markAsRead
};