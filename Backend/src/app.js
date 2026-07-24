const express = require("express");
const cors = require("cors");
// Import authentication routes
const authRoutes = require("./routes/authRoutes");
const app = express();
// Import listing routes
const listingRoutes = require("./routes/listingRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);
// Listing Routes
app.use("/api/listings", listingRoutes);
// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 RentMate Backend is Running..."
    });
});

module.exports = app;