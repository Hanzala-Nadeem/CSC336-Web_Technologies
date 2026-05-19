// Shop Routes — Product Browsing (moved from server.js)
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Products page — with pagination, search, filtering, sorting
router.get("/", async function (req, res) {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 8;
        let skip = (page - 1) * limit;

        // Build filter object
        let filter = {};

        // Search by name
        if (req.query.search && req.query.search.trim() !== "") {
            filter.name = { $regex: req.query.search.trim(), $options: "i" };
        }

        // Category filter (now by ObjectId)
        if (req.query.category && req.query.category !== "All") {
            // Find the category by name to get its ID
            const cat = await Category.findOne({ name: req.query.category });
            if (cat) {
                filter.category = cat._id;
            }
        }

        // Price range
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Sort
        let sort = {};
        switch (req.query.sort) {
            case "price_asc":  sort = { price: 1 };      break;
            case "price_desc": sort = { price: -1 };     break;
            case "newest":     sort = { createdAt: -1 };  break;
            case "rating":     sort = { rating: -1 };     break;
            default:           sort = { createdAt: -1 };
        }

        // Query database with populate
        let totalProducts = await Product.countDocuments(filter);
        let totalPages = Math.ceil(totalProducts / limit);
        let products = await Product.find(filter)
            .populate("category")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get all categories for filter sidebar
        let categories = await Category.find().sort("name");
        let categoryNames = categories.map(c => c.name);

        // Render the products page
        res.render("products", {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            categories: categoryNames,
            query: req.query
        });

    } catch (error) {
        console.error("Products route error:", error);
        res.status(500).send("Server Error");
    }
});

// Search suggestions API (returns JSON for autocomplete)
router.get("/suggestions", async function (req, res) {
    try {
        let q = req.query.q || "";
        if (q.length < 2) return res.json([]);

        let suggestions = await Product.find(
            { name: { $regex: q, $options: "i" } },
            { name: 1, price: 1, image: 1, category: 1 }
        ).populate("category", "name").limit(5);

        res.json(suggestions);
    } catch (error) {
        res.json([]);
    }
});

// Single product detail (JSON for quick view modal)
router.get("/:id", async function (req, res) {
    try {
        let product = await Product.findById(req.params.id).populate("category");
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
