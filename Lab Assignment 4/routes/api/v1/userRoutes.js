// ============================================================
// API USER ROUTES — Protected User Profile Endpoint
// ============================================================
// GET /api/v1/user/profile — Returns authenticated user's profile

const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const verifyToken = require("../../../middlewares/verifyToken");

// Apply JWT verification to all user routes
router.use(verifyToken);

// GET /api/v1/user/profile — Get authenticated user's profile
router.get("/profile", async (req, res) => {
    try {
        // Find user by ID from JWT payload, exclude password field
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (err) {
        console.error("API Profile error:", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching profile."
        });
    }
});

module.exports = router;
