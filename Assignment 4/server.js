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

// Import database connection
const connectDB = require("./config/db");

// Import middleware
const globalMiddleware = require("./middlewares/global");
const { isAdmin } = require("./middlewares/auth");

// Import route files
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminIndexRoutes = require("./routes/admin/index");
const adminProductRoutes = require("./routes/admin/products");
const adminCategoryRoutes = require("./routes/admin/categories");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ===================== EJS SETUP =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// ===================== BUILT-IN MIDDLEWARE =====================
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

// Admin routes (protected — admin only)
app.use("/admin", isAdmin, adminIndexRoutes);
app.use("/admin/products", isAdmin, adminProductRoutes);
app.use("/admin/categories", isAdmin, adminCategoryRoutes);

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