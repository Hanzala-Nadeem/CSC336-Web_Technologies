// ============================================================
// CHECKOUT ROUTES — Order placement flow
// ============================================================

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const { isLoggedIn } = require("../middlewares/auth");

// Apply login check to all checkout routes
router.use(isLoggedIn);

// GET /checkout — Render checkout page with cart data
router.get("/", async function (req, res) {
    try {
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            req.flash("error", "Your bag is empty. Add items before checking out.");
            return res.redirect("/products");
        }

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

        const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
        const total = subtotal + tax;

        res.render("checkout", {
            layout: false,
            title: "Checkout",
            cartItems: cartItems,
            subtotal: subtotal,
            tax: tax,
            total: total
        });

    } catch (err) {
        console.error("Checkout page error:", err);
        req.flash("error", "Error loading checkout");
        res.redirect("/cart");
    }
});

// POST /checkout — Create the order
router.post("/", async function (req, res) {
    try {
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            req.flash("error", "Your bag is empty.");
            return res.redirect("/products");
        }

        const { address, city, zip } = req.body;

        // Build order items and calculate total server-side
        let orderItems = [];
        let total = 0;

        for (const item of cart) {
            const product = await Product.findById(item.productId);
            if (!product) {
                req.flash("error", "A product in your cart no longer exists.");
                return res.redirect("/cart");
            }

            if (product.stock < item.quantity) {
                req.flash("error", "Insufficient stock for " + product.name + ". Available: " + product.stock);
                return res.redirect("/cart");
            }

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Add tax
        const tax = Math.round(total * 0.05 * 100) / 100;
        total = total + tax;

        // Create the order
        const order = new Order({
            user: req.session.user._id,
            items: orderItems,
            total: total,
            shippingInfo: {
                address: address || "",
                city: city || "",
                zip: zip || ""
            },
            status: "pending"
        });

        await order.save();

        // Reduce stock for each product
        for (const item of cart) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear the cart
        req.session.cart = [];

        // Populate for confirmation page
        await order.populate("items.product", "name price image");

        req.flash("success", "Order placed successfully!");
        res.render("order-confirmation", {
            layout: false,
            title: "Order Confirmed",
            order: order
        });

    } catch (err) {
        console.error("Checkout error:", err);
        req.flash("error", "Error placing order. Please try again.");
        res.redirect("/checkout");
    }
});

module.exports = router;
