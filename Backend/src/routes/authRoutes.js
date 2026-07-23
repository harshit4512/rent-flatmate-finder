// Purpose of this file:
//
// This file contains all routes related to user authentication.
//
// Responsibilities:
// - Register a new user.
// - Login an existing user.
// - Validate incoming request data before
//   sending it to the controller.

// Import express
const express = require("express");

// Create router object
const router = express.Router();

// Import express-validator
const { body } = require("express-validator");

// Import controller functions
const {
    register,
    login
} = require("../controllers/authController");


// =======================================
// Register Route
//
// Endpoint:
// POST /api/auth/register
//
// Validations:
// - Name should not be empty.
// - Email should be valid.
// - Password should have at least 6 characters.
// - Role should be owner, tenant or admin.
//
// =======================================

router.post(

    "/register",

    [

        body("name")
            .notEmpty()
            .withMessage("Name is required"),

        body("email")
            .isEmail()
            .withMessage("Invalid email"),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must contain at least 6 characters"),

        body("role")
            .isIn(["owner", "tenant", "admin"])
            .withMessage("Invalid role")

    ],

    register

);


// =======================================
// Login Route
//
// Endpoint:
// POST /api/auth/login
//
// Validations:
// - Email should be valid.
// - Password should not be empty.
//
// =======================================

router.post(

    "/login",

    [

        body("email")
            .isEmail()
            .withMessage("Invalid email"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")

    ],

    login

);


// Export router
module.exports = router;