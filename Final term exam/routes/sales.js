// ============================================================
// SALES ROUTES — Dashboard + JSON API for real-time polling
// ============================================================
// GET  /sales          → Server-rendered sales dashboard
// GET  /api/sales-data → JSON endpoint for jQuery polling

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// ── Helper: Compute all sales statistics ──
async function getSalesData() {
    // 1. Total Revenue
    const revenueResult = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Orders by Status
    const statusCounts = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    let pendingOrders = 0, shippedOrders = 0, deliveredOrders = 0, cancelledOrders = 0;
    statusCounts.forEach(function (s) {
        if (s._id === "pending") pendingOrders = s.count;
        if (s._id === "shipped") shippedOrders = s.count;
        if (s._id === "delivered") deliveredOrders = s.count;
        if (s._id === "cancelled") cancelledOrders = s.count;
    });

    // 4. Top-Selling Product (by units sold)
    const topProductResult = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                unitsSold: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 1 }
    ]);

    let topProduct = { name: "N/A", unitsSold: 0, revenue: 0, image: "images/placeholder.avif" };
    if (topProductResult.length > 0) {
        const productDoc = await Product.findById(topProductResult[0]._id);
        if (productDoc) {
            topProduct = {
                name: productDoc.name,
                unitsSold: topProductResult[0].unitsSold,
                revenue: topProductResult[0].revenue,
                image: productDoc.image
            };
        }
    }

    // 5. Recent Orders (last 10)
    const recentOrders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name price image")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    // Format recent orders for display
    const formattedOrders = recentOrders.map(function (order) {
        const itemNames = order.items.map(function (i) {
            return i.product ? i.product.name : "Deleted Product";
        });
        return {
            _id: order._id,
            customerName: order.user ? order.user.name : "Unknown",
            customerEmail: order.user ? order.user.email : "",
            items: itemNames.join(", "),
            itemCount: order.items.length,
            total: order.total,
            status: order.status,
            date: order.createdAt
        };
    });

    // 6. Average Order Value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: totalOrders,
        pendingOrders: pendingOrders,
        shippedOrders: shippedOrders,
        deliveredOrders: deliveredOrders,
        cancelledOrders: cancelledOrders,
        topProduct: topProduct,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        recentOrders: formattedOrders
    };
}

// ── GET /sales — Server-rendered dashboard page ──
router.get("/sales", async function (req, res) {
    try {
        const data = await getSalesData();

        res.render("sales", {
            layout: "layouts/main",
            title: "Sales Dashboard",
            salesData: data
        });

    } catch (err) {
        console.error("Sales dashboard error:", err);
        res.status(500).send("Server Error loading sales dashboard");
    }
});

// ── GET /api/sales-data — JSON endpoint for jQuery polling ──
router.get("/api/sales-data", async function (req, res) {
    try {
        const data = await getSalesData();
        res.json(data);

    } catch (err) {
        console.error("Sales API error:", err);
        res.status(500).json({ error: "Server error fetching sales data" });
    }
});

module.exports = router;
