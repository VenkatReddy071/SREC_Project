const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/,
    },
    customerPhoneNumber: {
        type: String,
        trim: true,
        default: ""
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    mall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mall',
        required: true,
    },
    storeName: {
        type: String,
        required: true,
        trim: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            priceAtOrder: {
                type: Number,
                required: true,
                min: 0,
            },
            selectedSize: {
                type: String,
                trim: true,
            },
            selectedColor: {
                type: String,
                trim: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        default: "INR",
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "UPI", "Other"],
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled", "Refunded"],
        default: "Pending",
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema, "Orders");