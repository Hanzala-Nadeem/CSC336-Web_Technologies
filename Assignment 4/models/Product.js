const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category is required"]
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

// Auto-generate slug from name before saving
productSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
});

module.exports = mongoose.model("Product", productSchema);
