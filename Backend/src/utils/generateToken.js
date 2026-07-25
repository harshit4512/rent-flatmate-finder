// Purpose of this file:
//
// This file is responsible for generating a JSON Web Token (JWT).
//
// JWT is used to identify an authenticated user.
// After a successful login or registration, the server
// creates a token and sends it to the client.
//
// Responsibilities:
// - Generate JWT token.
// - Store user ID inside the token.
// - Set token expiration time using .env variables.

// Import jsonwebtoken package
const jwt = require("jsonwebtoken");

// =======================================
// Generate JWT Token
//
// userId -> ID of the authenticated user.
//
// Returns:
// A signed JWT token.
// =======================================
function generateToken(userId) {

    // Create and return the JWT
    return jwt.sign(

        // Payload
        {
            id: userId
        },

        // Secret key from .env
        process.env.JWT_SECRET,

        // Token expiry time
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    );

}

// Export function
module.exports = generateToken;