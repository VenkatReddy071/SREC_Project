const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    offerType: {
        type: String,
        required: true,
        enum: ["Percentage_Discount", "Fixed_Amount_Discount", "Buy_X_Get_Y", "Cashback", "Flat_Rate"]
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minPurchaseAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        min: 0,
        default: null
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    mall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mall',
        required: true,
    },
    storeName: {
        type: String,
        trim: true,
        default: ""
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    promoCode: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        default: ""
    },
    image: {
        type: String,
        trim: true,
        default: ""
    },
}, { timestamps: true });

module.exports = mongoose.model("Offer", OfferSchema, "Offers");