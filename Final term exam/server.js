// ============================================================
// SERVER.JS — Main Application Entry Point (Modular)
// ============================================================

// Load environment variables
require("dotenv").config();

// Import core modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");

// Import database connection
const connectDB = require("./config/db");

// Import middleware
const globalMiddleware = require("./middlewares/global");
const { isAdmin, isLoggedIn } = require("./middlewares/auth");

// Import route files
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const salesRoutes = require("./routes/sales");
const adminIndexRoutes = require("./routes/admin/index");
const adminProductRoutes = require("./routes/admin/products");
const adminCategoryRoutes = require("./routes/admin/categories");

// Import API route files (JWT-based)
const apiAuthRoutes = require("./routes/api/v1/authRoutes");
const apiProductRoutes = require("./routes/api/v1/productRoutes");
const apiOrderRoutes = require("./routes/api/v1/orderRoutes");
const apiUserRoutes = require("./routes/api/v1/userRoutes");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ===================== EJS SETUP =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// express-ejs-layouts — default layout disabled so existing pages aren't broken
app.set("layout", false);
app.use(expressLayouts);

// ===================== BUILT-IN MIDDLEWARE =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use(cookieParser());

// ===================== SESSION CONFIG =====================
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60  // 1 day
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  // 1 day
    }
}));

// ===================== FLASH MESSAGES (connect-flash) =====================
app.use(flash());

// ===================== CUSTOM GLOBAL MIDDLEWARE =====================
app.use(globalMiddleware);

// ===================== ROUTE MOUNTING =====================

// Homepage
app.get("/", function (req, res) {
    return res.render("index");
});

// Auth routes
app.use("/auth", authRoutes);

// Shop / Product browsing routes
app.use("/products", shopRoutes);

// Cart routes
app.use("/cart", cartRoutes);

// Checkout routes (protected — logged-in users only)
app.use("/checkout", checkoutRoutes);

// Sales Dashboard + API (mounted at root — routes define /sales and /api/sales-data)
app.use("/", salesRoutes);

// Admin routes (protected — admin only)
app.use("/admin", isAdmin, adminIndexRoutes);
app.use("/admin/products", isAdmin, adminProductRoutes);
app.use("/admin/categories", isAdmin, adminCategoryRoutes);

// ===================== API ROUTES (JWT-based) =====================
app.use("/api/v1/auth", apiAuthRoutes);
app.use("/api/v1/products", apiProductRoutes);
app.use("/api/v1/orders", apiOrderRoutes);
app.use("/api/v1/user", apiUserRoutes);

// ===================== 404 HANDLER =====================
app.use(function (req, res) {
    res.status(404).render("index", {
        title: "404 — Page Not Found"
    });
});

// ===================== START SERVER =====================
app.listen(PORT, function () {
    console.log("Server Started at http://localhost:" + PORT);
});