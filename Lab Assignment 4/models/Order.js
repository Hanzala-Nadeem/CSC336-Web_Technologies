// ============================================================
// ORDER MODEL — Stores user orders with items, totals & status
// ============================================================

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    total: {
        type: Number,
        required: [true, "Order total is required"],
        min: 0
    },
    shippingInfo: {
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        zip: { type: String, default: "" }
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
