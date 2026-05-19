// Admin Category CRUD Routes
const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const Product = require("../../models/Product");

// GET /admin/categories — List all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find().sort("name");

        // Count products for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const productCount = await Product.countDocuments({ category: cat._id });
                return { ...cat.toObject(), productCount };
            })
        );

        res.render("admin/categories/index", {
            title: "Manage Categories",
            categories: categoriesWithCount
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// GET /admin/categories/new — New category form
router.get("/new", (req, res) => {
    res.render("admin/categories/form", {
        title: "Add New Category",
        category: null,
        editing: false
    });
});

// POST /admin/categories — Create category
router.post("/", async (req, res) => {
    try {
        await Category.create({
            name: req.body.name,
            description: req.body.description
        });
        req.flash("success", "Category created successfully!");
        res.redirect("/admin/categories");

    } catch (err) {
        console.error("Create category error:", err);
        req.flash("error", "Error creating category: " + err.message);
        res.redirect("/admin/categories/new");
    }
});

// GET /admin/categories/edit/:id — Edit category form
router.get("/edit/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            req.flash("error", "Category not found");
            return res.redirect("/admin/categories");
        }

        res.render("admin/categories/form", {
            title: "Edit Category",
            category,
            editing: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST /admin/categories/edit/:id — Update category
router.post("/edit/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            req.flash("error", "Category not found");
            return res.redirect("/admin/categories");
        }

        category.name = req.body.name;
        category.description = req.body.description;
        await category.save(); // triggers pre-save slug regeneration

        req.flash("success", "Category updated successfully!");
        res.redirect("/admin/categories");

    } catch (err) {
        console.error("Update category error:", err);
        req.flash("error", "Error updating category");
        res.redirect("/admin/categories/edit/" + req.params.id);
    }
});

// POST /admin/categories/delete/:id — Delete category
router.post("/delete/:id", async (req, res) => {
    try {
        // Check if any products use this category
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            req.flash("error", "Cannot delete category — " + productCount + " products are using it. Reassign them first.");
            return res.redirect("/admin/categories");
        }

        await Category.findByIdAndDelete(req.params.id);
        req.flash("success", "Category deleted successfully!");
        res.redirect("/admin/categories");

    } catch (err) {
        console.error("Delete category error:", err);
        req.flash("error", "Error deleting category");
        res.redirect("/admin/categories");
    }
});

module.exports = router;
