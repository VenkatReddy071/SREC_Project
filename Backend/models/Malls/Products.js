const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    images: [
        {
            type: String,
            trim: true
        }
    ],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        default: "INR"
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "Men",
            "Women",
            "Kids",
            "Books",
            "Footwear",
            "Accessories",
            "Gifts"
        ]
    },
    brand: {
        type: String,
        trim: true,
        default: ""
    },
    availableSizes: [
        {
            type: String,
            trim: true
        }
    ],
    availableColors: [
        {
            type: String,
            trim: true
        }
    ],
    material: {
        type: String,
        trim: true,
        default: ""
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex", "Kids"],
        default: "Unisex"
    },
    mall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mall',
        required: true
    },
    storeName: {
        type: String,
        required: true,
        trim: true
    },
    stockQuantity: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive", "out_of_stock"],
        default: "active"
    },
    averageRating: {
        type: Number,
    min: 0,
    max: 5,
    default: 3
},
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema, "Products");