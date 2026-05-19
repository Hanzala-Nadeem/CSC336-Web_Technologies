// Admin Product CRUD Routes
const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const upload = require("../../middlewares/upload");
const fs = require("fs");
const path = require("path");

// GET /admin/products — List all products with pagination/sorting
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const sortField = req.query.sort || "createdAt";
        const sortOrder = req.query.order === "desc" ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find()
            .populate("category")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        res.render("admin/products/index", {
            title: "Manage Products",
            products,
            currentPage: page,
            totalPages,
            sortField,
            sortOrder: req.query.order || "asc"
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// GET /admin/products/new — New product form
router.get("/new", async (req, res) => {
    try {
        const categories = await Category.find().sort("name");
        res.render("admin/products/form", {
            title: "Add New Product",
            product: null,
            categories,
            editing: false
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// POST /admin/products — Create product
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            rating: req.body.rating || 0,
            collection: req.body.collection || "Originals"
        };

        if (req.file) {
            productData.image = "uploads/products/" + req.file.filename;
        }

        await Product.create(productData);
        req.flash("success", "Product created successfully!");
        res.redirect("/admin/products");

    } catch (err) {
        console.error("Create product error:", err);
        req.flash("error", "Error creating product: " + err.message);
        res.redirect("/admin/products/new");
    }
});

// GET /admin/products/edit/:id — Edit product form
router.get("/edit/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find().sort("name");

        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/admin/products");
        }

        res.render("admin/products/form", {
            title: "Edit Product",
            product,
            categories,
            editing: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST /admin/products/edit/:id — Update product
router.post("/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/admin/products");
        }

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            rating: req.body.rating || product.rating,
            collection: req.body.collection || product.collection
        };

        // Handle new image upload
        if (req.file) {
            // Delete old image if it was uploaded (not a static asset)
            if (product.image && product.image.startsWith("uploads/")) {
                const oldImagePath = path.join(__dirname, "../../Public", product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.image = "uploads/products/" + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        req.flash("success", "Product updated successfully!");
        res.redirect("/admin/products");

    } catch (err) {
        console.error("Update product error:", err);
        req.flash("error", "Error updating product");
        res.redirect("/admin/products/edit/" + req.params.id);
    }
});

// POST /admin/products/delete/:id — Delete product
router.post("/delete/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        // Delete uploaded image file
        if (product && product.image && product.image.startsWith("uploads/")) {
            const imagePath = path.join(__dirname, "../../Public", product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        req.flash("success", "Product deleted successfully!");
        res.redirect("/admin/products");

    } catch (err) {
        console.error("Delete product error:", err);
        req.flash("error", "Error deleting product");
        res.redirect("/admin/products");
    }
});

module.exports = router;
