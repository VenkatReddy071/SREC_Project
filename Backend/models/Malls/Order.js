// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     customerName: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     customerEmail: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         match: /^\S+@\S+\.\S+$/,
//     },
//     customerPhoneNumber: {
//         type: String,
//         trim: true,
//         default: ""
//     },
//     orderDate: {
//         type: Date,
//         default: Date.now,
//     },
//     mall: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Mall',
//         required: true,
//     },
//     storeName: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 min: 1,
//             },
//             priceAtOrder: {
//                 type: Number,
//                 required: true,
//                 min: 0,
//             },
//             selectedSize: {
//                 type: String,
//                 trim: true,
//             },
//             selectedColor: {
//                 type: String,
//                 trim: true,
//             },
//         },
//     ],
//     totalAmount: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     currency: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "INR",
//     },
//     paymentMethod: {
//         type: String,
//         enum: ["Cash", "Card", "UPI", "Other"],
//         required: true,
//     },
//     orderStatus: {
//         type: String,
//         enum: ["pending", "completed", "cancelled", "refunded","processing","shipped","delivered"],
//         default: "pending",
//     },
//     notes: {
//         type: String,
//         trim: true,
//         default: ""
//     },
// }, { timestamps: true });

// module.exports = mongoose.model("Order", OrderSchema, "Orders");



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
    sourceType: {
        type: String,
        enum: ['Restaurant', 'Mall'],
        required: true,
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'items.itemModelType',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            image: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            currency: {
                type: String,
                required: true,
                default: "INR",
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            itemModelType: { // Specifies which model 'product' ObjectId refers to ('Menu' or 'Product')
                type: String,
                required: true,
                enum: ['Menu', 'Product']
            },
            selectedSize: {
                type: String,
                trim: true,
            },
            selectedColor: {
                type: String,
                trim: true,
            },
            storeName: {
                type: String,
                trim: true,
            }
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    Tax:{
        type: Number,
        required: true,
        min: 0,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "UPI", "Other"],
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "processing", "ready_for_pickup", "shipped", "delivered", "completed", "cancelled", "refunded"],
        default: "pending",
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    },
    orderType: {
        type: String,
        enum: ['Takeaway', 'Dine-in'],
    },
    pickupTime: {
        type: Date,
    },
    estimatedCompletionTime: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema, "Orders");
