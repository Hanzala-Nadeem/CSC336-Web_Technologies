// ============================================================
// API ORDER ROUTES — Protected Order Endpoints
// ============================================================
// POST /api/v1/orders  — Submit a new order (requires JWT)
// GET  /api/v1/orders  — Get authenticated user's orders (requires JWT)

const express = require("express");
const router = express.Router();
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const verifyToken = require("../../../middlewares/verifyToken");

// Apply JWT verification to all order routes
router.use(verifyToken);

// POST /api/v1/orders — Create a new order
router.post("/", async (req, res) => {
    try {
        const { items, shippingInfo } = req.body;

        // Validate items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item."
            });
        }

        // Validate each item and compute total server-side
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            // Check required fields
            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must have a product ID and quantity."
                });
            }

            // Verify product exists in database
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found: " + item.product
                });
            }

            // Check stock availability
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock for: " + product.name + ". Available: " + product.stock
                });
            }

            // Use the database price (not client-supplied) to prevent manipulation
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create the order
        const order = new Order({
            user: req.user.id,
            items: orderItems,
            total: total,
            shippingInfo: shippingInfo || {}
        });

        await order.save();

        // Populate product details in the response
        await order.populate("items.product", "name price image");

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            data: order
        });

    } catch (err) {
        console.error("API Create order error:", err);
        res.status(500).json({
            success: false,
            message: "Server error creating order."
        });
    }
});

// GET /api/v1/orders — Get all orders for the authenticated user
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (err) {
        console.error("API Get orders error:", err);
        res.status(500).json({
            success: false,
            message: "Server error fetching orders."
        });
    }
});

module.exports = router;
