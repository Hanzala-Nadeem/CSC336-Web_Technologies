// ============================================================
// API PRODUCT ROUTES — Public Product Endpoints
// ============================================================
// GET /api/v1/products      — Paginated product list with filtering/sorting
// GET /api/v1/products/:id  — Single product details

const express = require("express");
const router = express.Router();
const Product = require("../../../models/Product");
const Category = require("../../../models/Category");

// GET /api/v1/products — List all products (paginated, filterable, sortable)
router.get("/", async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        // Build filter object
        let filter = {};

        // Search by name
        if (req.query.search && req.query.search.trim() !== "") {
            filter.name = { $regex: req.query.search.trim(), $options: "i" };
        }

        // Category filter (by name)
        if (req.query.category && req.query.category !== "All") {
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

        // Sort options
        let sort = {};
        switch (req.query.sort) {
            case "price_asc":  sort = { price: 1 };      break;
            case "price_desc": sort = { price: -1 };     break;
            case "newest":     sort = { createdAt: -1 };  break;
            case "rating":     sort = { rating: -1 };     break;
            default:           sort = { createdAt: -1 };
        }

        // Execute queries
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(filter)
            .populate("category")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProducts: totalProducts,
                limit: limit
            }
        });

    } catch (err) {
        console.error("API Products error:", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching products."
        });
    }
});

// GET /api/v1/products/:id — Get single product details
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (err) {
        console.error("API Product detail error:", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching product."
        });
    }
});

module.exports = router;
