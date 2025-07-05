
const mongoose = require("mongoose");
const subStatus=new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now(),
    },
    status:{
        type:String,
    }
})
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
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "UPI", "Other",'Takeaway'],
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "processing", "ready_for_pickup", "shipped", "delivered", "completed", "cancelled", "refunded","user_cancel"],
        default: "pending",
    },
    reasion:{
        type:String,
        required:this.orderStatus==="user_cancel",
    },
    appliedTaxes:[
        {
            name:{
                type:String,
            },
            amountApplied:{
                type:Number,
                min:0,
            }
        }
    ],
    notes: {
        type: String,
        trim: true,
        default: ""
    },
    orderType: {
        type: String,
        enum: ['Takeaway', 'Dine-in'],
    },
    shippingAddress: {
        street: {
            type: String,
            trim: true,
            required: function() {
                // Required only if any item in the order is of type 'Product'
                return this.items.some(item => item.itemModelType === 'Product');
            }
        },
        city: {
            type: String,
            trim: true,
            required: function() {
                return this.items.some(item => item.itemModelType === 'Product');
            }
        },
        state: {
            type: String,
            trim: true,
            required: function() {
                return this.items.some(item => item.itemModelType === 'Product');
            }
        },
        zipCode: {
            type: String,
            trim: true,
            required: function() {
                return this.items.some(item => item.itemModelType === 'Product');
            }
        },
        country: {
            type: String,
            trim: true,
            default: "India",
            required: function() {
                return this.items.some(item => item.itemModelType === 'Product');
            }
        },
    },
    pickupTime: {
        type: Date,
    },
    estimatedCompletionTime: {
        type: Date,
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        default: null,
    },
    discountValue:{
        type:Number,
    },
    subStatus:[subStatus],
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema, "Orders");