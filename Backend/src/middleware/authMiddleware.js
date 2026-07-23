// Purpose of this file:
//
// This middleware is responsible for protecting private routes.
//
// Responsibilities:
// - Read JWT token from request header.
// - Verify whether the token is valid.
// - Extract user ID from the token.
// - Fetch user details from the database.
// - Attach user information to req.user.
// - Allow authenticated users to access protected routes.

// Import jsonwebtoken package
const jwt = require("jsonwebtoken");

// Import user model
const { findUserById } = require("../models/userModel");

// =======================================
// Protect Route Middleware
//
// Steps:
//
// 1. Read Authorization header.
// 2. Check if token exists.
// 3. Verify token.
// 4. Get user ID from token.
// 5. Fetch user details.
// 6. Attach user to req.user.
// 7. Continue to next middleware.
//
// =======================================

async function protect(req, res, next) {

    try {

        let token;

        // Check if Authorization header exists
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            // Extract token
            token = req.headers.authorization.split(" ")[1];

        }

        // If token is not provided
        if (!token) {

            return res.status(401).json({

                success: false,
                message: "Access denied. Token not provided."

            });

        }

        // Verify token
        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        // Find user from database
        const user = await findUserById(decoded.id);

        // Check whether user exists
        if (!user) {

            return res.status(401).json({

                success: false,
                message: "User not found."

            });

        }

        // Store logged-in user inside request
        req.user = user;

        // Continue to next middleware
        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,
            message: "Invalid or expired token."

        });

    }

}

// Export middleware
module.exports = {
    protect
};