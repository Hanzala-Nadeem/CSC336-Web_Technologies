const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        enum: ["Shoes", "Clothing", "Accessories", "Sports Equipment"]
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        type: String,
        default: "images/placeholder.avif"
    },
    description: {
        type: String,
        default: ""
    },
    collection: {
        type: String,
        default: "Originals"
    }
}, {
    timestamps: true,  // Adds createdAt and updatedAt automatically
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model("Product", productSchema);
