// Admin Dashboard Route
const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const User = require("../../models/User");

// GET /admin — Dashboard with summary stats
router.get("/", async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        const userCount = await User.countDocuments();

        // Get recent products (top 5)
        const recentProducts = await Product.find()
            .populate("category")
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("admin/dashboard", {
            title: "Admin Dashboard",
            productCount,
            categoryCount,
            userCount,
            recentProducts
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
