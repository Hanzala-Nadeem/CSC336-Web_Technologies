// ============================================================
// CART ROUTES — Session-based shopping cart
// ============================================================

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /cart — Render the cart page
router.get("/", async function (req, res) {
    try {
        const cart = req.session.cart || [];
        let cartItems = [];
        let subtotal = 0;

        for (const item of cart) {
            const product = await Product.findById(item.productId).populate("category");
            if (product) {
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;
                cartItems.push({
                    product: product,
                    quantity: item.quantity,
                    itemTotal: itemTotal
                });
            }
        }

        res.render("cart", {
            layout: false,
            title: "Shopping Bag",
            cartItems: cartItems,
            subtotal: subtotal,
            total: subtotal // Free shipping
        });

    } catch (err) {
        console.error("Cart page error:", err);
        req.flash("error", "Error loading cart");
        res.redirect("/");
    }
});

// POST /cart/add — Add a product to the cart
router.post("/add", async function (req, res) {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check stock
        if (product.stock < qty) {
            return res.status(400).json({ success: false, message: "Insufficient stock. Available: " + product.stock });
        }

        // Initialize cart if needed
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if product already in cart
        const existingIndex = req.session.cart.findIndex(function (item) {
            return item.productId === productId;
        });

        if (existingIndex > -1) {
            // Update quantity
            req.session.cart[existingIndex].quantity += qty;
        } else {
            // Add new item
            req.session.cart.push({ productId: productId, quantity: qty });
        }

        // Calculate new cart count
        const cartCount = req.session.cart.reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);

        res.json({
            success: true,
            message: product.name + " added to bag!",
            cartCount: cartCount
        });

    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
});

// POST /cart/update — Update item quantity
router.post("/update", function (req, res) {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity);

        if (!req.session.cart) {
            return res.redirect("/cart");
        }

        if (qty <= 0) {
            // Remove item
            req.session.cart = req.session.cart.filter(function (item) {
                return item.productId !== productId;
            });
        } else {
            // Update quantity
            const item = req.session.cart.find(function (item) {
                return item.productId === productId;
            });
            if (item) {
                item.quantity = qty;
            }
        }

        req.flash("success", "Cart updated");
        res.redirect("/cart");

    } catch (err) {
        console.error("Update cart error:", err);
        req.flash("error", "Error updating cart");
        res.redirect("/cart");
    }
});

// POST /cart/remove — Remove item from cart
router.post("/remove", function (req, res) {
    try {
        const { productId } = req.body;

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(function (item) {
                return item.productId !== productId;
            });
        }

        req.flash("success", "Item removed from bag");
        res.redirect("/cart");

    } catch (err) {
        console.error("Remove from cart error:", err);
        req.flash("error", "Error removing item");
        res.redirect("/cart");
    }
});

// GET /cart/data — JSON endpoint for cart badge
router.get("/data", function (req, res) {
    const cart = req.session.cart || [];
    const cartCount = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);
    res.json({ cartCount: cartCount });
});

module.exports = router;
