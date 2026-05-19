// Authentication Routes — Login, Register, Logout
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /auth/login — Render login form
router.get("/login", (req, res) => {
    // Redirect logged-in users away from login page
    if (req.session.user) {
        req.flash("success", "You are already logged in.");
        return res.redirect("/");
    }
    res.render("auth/login", { title: "Login" });
});

// GET /auth/register — Render registration form
router.get("/register", (req, res) => {
    // Redirect logged-in users away from register page
    if (req.session.user) {
        req.flash("success", "You are already logged in.");
        return res.redirect("/");
    }
    res.render("auth/register", { title: "Register" });
});

// POST /auth/register — Handle registration
router.post("/register", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            req.flash("error", "Please fill in all fields");
            return res.redirect("/auth/register");
        }

        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters");
            return res.redirect("/auth/register");
        }

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match");
            return res.redirect("/auth/register");
        }

        // Check if email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email already registered");
            return res.redirect("/auth/register");
        }

        // Create new user (password hashed in pre-save hook)
        const user = new User({ name, email, password });
        await user.save();

        req.flash("success", "You are now registered! Please log in.");
        res.redirect("/auth/login");

    } catch (err) {
        console.error("Registration error:", err);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/auth/register");
    }
});

// POST /auth/login — Handle login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            req.flash("error", "Please fill in all fields");
            return res.redirect("/auth/login");
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "That email is not registered");
            return res.redirect("/auth/login");
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash("error", "Incorrect password");
            return res.redirect("/auth/login");
        }

        // Create session
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash("success", "Welcome back, " + user.name + "!");

        // Redirect admins to admin panel, customers to homepage
        if (user.role === "admin") {
            res.redirect("/admin");
        } else {
            res.redirect("/");
        }

    } catch (err) {
        console.error("Login error:", err);
        req.flash("error", "Login failed. Please try again.");
        res.redirect("/auth/login");
    }
});

// GET /auth/logout — Clear user session, redirect
router.get("/logout", (req, res) => {
    req.session.destroy(function () {
        res.redirect("/");
    });
});

module.exports = router;
