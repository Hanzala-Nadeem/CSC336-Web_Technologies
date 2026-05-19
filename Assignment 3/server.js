// Load environment variables
require("dotenv").config();

// Import modules
let express = require("express");
let connectDB = require("./config/db");
let Product = require("./models/Product");

// Initialize express
let app = express();
let PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===================== ROUTES =====================

// Homepage
app.get("/", function (req, res) {
    return res.render("index");
});

// Products page — with pagination, search, filtering, sorting
app.get("/products", async function (req, res) {
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

        // Category filter
        if (req.query.category && req.query.category !== "All") {
            filter.category = req.query.category;
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

        // Query database
        let totalProducts = await Product.countDocuments(filter);
        let totalPages = Math.ceil(totalProducts / limit);
        let products = await Product.find(filter).sort(sort).skip(skip).limit(limit);

        // Get all unique categories for filter sidebar
        let categories = await Product.distinct("category");

        // Render the products page
        res.render("products", {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            categories,
            query: req.query
        });

    } catch (error) {
        console.error("Products route error:", error);
        res.status(500).send("Server Error");
    }
});

// Search suggestions API (returns JSON for autocomplete)
app.get("/products/suggestions", async function (req, res) {
    try {
        let q = req.query.q || "";
        if (q.length < 2) return res.json([]);

        let suggestions = await Product.find(
            { name: { $regex: q, $options: "i" } },
            { name: 1, price: 1, image: 1, category: 1 }
        ).limit(5);

        res.json(suggestions);
    } catch (error) {
        res.json([]);
    }
});

// Single product detail (JSON for quick view modal)
app.get("/products/:id", async function (req, res) {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
app.listen(PORT, function () {
    console.log("Server Started at localhost:" + PORT);
});