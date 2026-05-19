// ============================================================
// API AUTH ROUTES — JWT Login Endpoint
// ============================================================
// POST /api/v1/auth/login — Authenticate user and return JWT token

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");

// POST /api/v1/auth/login — Login and receive JWT token
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare password using the model's built-in method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Create JWT payload
        const payload = {
            user_id: user._id,
            role: user.role
        };

        // Sign the token with 1 hour expiration
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // Return token and user info (excluding password)
        res.status(200).json({
            success: true,
            message: "Login successful.",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("API Login error:", err);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

module.exports = router;
