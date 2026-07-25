// Purpose of this file:
//
// This file contains all business logic related to
// property listings.
//
// It is responsible for:
// - Creating a new listing.
// - Fetching all available listings.
// - Fetching a listing by ID.
// - Fetching all listings of a logged-in owner.
// - Updating listing details.
// - Marking a listing as filled.
// - Deleting a listing.

// Import listing model functions
const {
    createListing,
    getAllListings,
    getListingById,
    getListingsByOwner,
    updateListing,
    markListingFilled,
    deleteListing
} = require("../models/listingModel");


// =======================================
// Create Listing
//
// Steps:
//
// 1. Read listing details from request body.
// 2. Get owner ID from authenticated user.
// 3. Save listing in database.
// 4. Return created listing ID.
//
// =======================================

async function createNewListing(req, res) {

    try {

        const {

            title,
            description,
            location,
            rent,
            available_from,
            room_type,
            furnishing_status

        } = req.body;

        // Logged-in owner's ID
        const owner_id = req.user.id;

        // Save listing
        const listingId = await createListing({

            owner_id,
            title,
            description,
            location,
            rent,
            available_from,
            room_type,
            furnishing_status

        });

        return res.status(201).json({

            success: true,
            message: "Listing created successfully",

            listingId

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
// Get All Listings
//
// Returns every available property.
//
// =======================================

async function getListings(req, res) {

    try {

        const listings = await getAllListings();

        return res.status(200).json({

            success: true,
            count: listings.length,
            listings

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
// Get Listing By ID
//
// =======================================

async function getListing(req, res) {

    try {

        const listing = await getListingById(req.params.id);

        if (!listing) {

            return res.status(404).json({

                success: false,
                message: "Listing not found"

            });

        }

        return res.status(200).json({

            success: true,
            listing

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
// Get Logged-in Owner Listings
//
// =======================================

async function getMyListings(req, res) {

    try {

        const listings = await getListingsByOwner(req.user.id);

        return res.status(200).json({

            success: true,
            count: listings.length,
            listings

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
// Update Listing
//
// Steps:
//
// 1. Get listing ID from URL.
// 2. Check whether listing exists.
// 3. Verify logged-in owner owns this listing.
// 4. Update listing details.
// 5. Return success response.
//
// =======================================

async function updateOwnerListing(req, res) {

    try {

        // Get listing ID
        const listingId = req.params.id;

        // Find listing
        const listing = await getListingById(listingId);

        if (!listing) {

            return res.status(404).json({

                success: false,
                message: "Listing not found"

            });

        }

        // Check ownership
        if (listing.owner_id !== req.user.id) {

            return res.status(403).json({

                success: false,
                message: "You are not allowed to update this listing."

            });

        }

        // Update listing
        await updateListing(listingId, req.body);

        return res.status(200).json({

            success: true,
            message: "Listing updated successfully"

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
// Mark Listing as Filled
//
// Steps:
//
// 1. Get listing ID.
// 2. Verify listing exists.
// 3. Verify ownership.
// 4. Update status to "filled".
//
// =======================================

async function markOwnerListingFilled(req, res) {

    try {

        const listingId = req.params.id;

        const listing = await getListingById(listingId);

        if (!listing) {

            return res.status(404).json({

                success: false,
                message: "Listing not found"

            });

        }

        if (listing.owner_id !== req.user.id) {

            return res.status(403).json({

                success: false,
                message: "You are not allowed to update this listing."

            });

        }

        await markListingFilled(listingId);

        return res.status(200).json({

            success: true,
            message: "Listing marked as filled"

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
// Delete Listing
//
// Steps:
//
// 1. Get listing ID.
// 2. Verify listing exists.
// 3. Verify ownership.
// 4. Delete listing.
//
// =======================================

async function deleteOwnerListing(req, res) {

    try {

        const listingId = req.params.id;

        const listing = await getListingById(listingId);

        if (!listing) {

            return res.status(404).json({

                success: false,
                message: "Listing not found"

            });

        }

        if (listing.owner_id !== req.user.id) {

            return res.status(403).json({

                success: false,
                message: "You are not allowed to delete this listing."

            });

        }

        await deleteListing(listingId);

        return res.status(200).json({

            success: true,
            message: "Listing deleted successfully"

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

    createNewListing,
    getListings,
    getListing,
    getMyListings,

    updateOwnerListing,
    markOwnerListingFilled,
    deleteOwnerListing

};