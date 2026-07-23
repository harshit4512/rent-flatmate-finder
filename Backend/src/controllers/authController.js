// Purpose of this file:
//
// This file contains all the business logic related to
// user authentication.
//
// It is responsible for:
// - Registering a new user.
// - Logging in an existing user.
// - Checking if an email already exists.
// - Hashing passwords before storing them.
// - Generating JWT tokens after successful authentication.

// Import bcrypt package for password hashing
const bcrypt = require("bcryptjs");

// Import express-validator
const { validationResult } = require("express-validator");

// Import functions from user model
const {
    createUser,
    findUserByEmail
} = require("../models/userModel");

// Import JWT generator
const generateToken = require("../utils/generateToken");


// =======================================
// Register User
//
// Steps:
//
// 1. Validate incoming request.
// 2. Check if email already exists.
// 3. Hash the password.
// 4. Save user into database.
// 5. Generate JWT.
// 6. Return user details.
//
// =======================================

async function register(req, res) {

    try {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,
                errors: errors.array()

            });

        }

        // Extract user data from request body
        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;

        // Check whether email already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {

            return res.status(400).json({

                success: false,
                message: "Email already exists"

            });

        }

        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const userId = await createUser({

            name,
            email,
            password: hashedPassword,
            phone,
            role

        });

        // Generate authentication token
        const token = generateToken(userId);

        // Send response
        return res.status(201).json({

            success: true,
            message: "User registered successfully",

            token,

            user: {

                id: userId,
                name,
                email,
                phone,
                role

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

}


// =======================================
// Login User
//
// Steps:
//
// 1. Validate incoming request.
// 2. Find user using email.
// 3. Compare entered password with
//    the hashed password stored in database.
// 4. Generate JWT token.
// 5. Return user details and token.
//
// =======================================

async function login(req, res) {

    try {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,
                errors: errors.array()

            });

        }

        // Extract email and password from request body
        const { email, password } = req.body;

        // Find user using email
        const user = await findUserByEmail(email);

        // Check if user exists
        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password"

            });

        }

        // Compare entered password with hashed password
        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );

        // If password does not match
        if (!isPasswordMatched) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password"

            });

        }

        // Generate JWT token
        const token = generateToken(user.id);

        // Login successful
        return res.status(200).json({

            success: true,
            message: "Login successful",

            token,

            user: {

                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

}

// Export controller functions
module.exports = {

    register,
    login

};