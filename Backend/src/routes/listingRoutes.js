// Purpose of this file:
//
// This file contains all routes related to property listings.
//
// It is responsible for:
// - Creating a new listing.
// - Viewing all available listings.
// - Viewing a single listing.
// - Viewing all listings created by a logged-in owner.
//
// It also protects private routes using
// authentication and role-based authorization.

// Import express
const express = require("express");

// Create router object
const router = express.Router();

// Import controller functions
const {
    createNewListing,
    getListings,
    getListing,
    getMyListings,
    updateOwnerListing,
    markOwnerListingFilled,
    deleteOwnerListing
} = require("../controllers/listingController");
// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Import role authorization middleware
const { authorize } = require("../middleware/roleMiddleware");


// =======================================
// Create Listing
//
// Endpoint:
// POST /api/listings
//
// Access:
// Owner Only
//
// =======================================

router.post(

    "/",

    protect,

    authorize("owner"),

    createNewListing

);


// =======================================
// Get All Listings
//
// Endpoint:
// GET /api/listings
//
// Access:
// Any Logged-in User
//
// =======================================

router.get(

    "/",

    protect,

    getListings

);


// =======================================
// Get My Listings
//
// Endpoint:
// GET /api/listings/my
//
// Access:
// Owner Only
//
// =======================================

router.get(

    "/my",

    protect,

    authorize("owner"),

    getMyListings

);


// =======================================
// Get Listing By ID
//
// Endpoint:
// GET /api/listings/:id
//
// Access:
// Any Logged-in User
//
// =======================================

router.get(

    "/:id",

    protect,

    getListing

);

// =======================================
// Update Listing
//
// Endpoint:
// PUT /api/listings/:id
//
// Access:
// Owner Only
//
// =======================================

router.put(

    "/:id",

    protect,

    authorize("owner"),

    updateOwnerListing

);


// =======================================
// Mark Listing as Filled
//
// Endpoint:
// PATCH /api/listings/:id/fill
//
// Access:
// Owner Only
//
// =======================================

router.patch(

    "/:id/fill",

    protect,

    authorize("owner"),

    markOwnerListingFilled

);


// =======================================
// Delete Listing
//
// Endpoint:
// DELETE /api/listings/:id
//
// Access:
// Owner Only
//
// =======================================

router.delete(

    "/:id",

    protect,

    authorize("owner"),

    deleteOwnerListing

);


// Export router
module.exports = router;