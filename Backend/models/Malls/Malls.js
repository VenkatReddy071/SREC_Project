const mongoose = require("mongoose");


const Offers = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    percentage: {
        type: Boolean,
        default: false,
    },
    value: {
        type: Number,
        required: true,
    },
    applicable: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    }
}, { timestamps: true });


const OperatingHoursSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    openTime: {
        type: String,
        required: function() { return !this.isClosed; }, // Required only if not closed for the day
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format for open time.'],
    },
    closeTime: {
        type: String,
        required: function() { return !this.isClosed; }, // Required only if not closed for the day
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format for close time.'],
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
});
const taxChargeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: 0,
    },
    isApplicable: {
        type: Boolean,
        default: true,
    },
}, {
timestamps:true
});
const MallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    gallery: [
        {
            type: String,
            trim: true
        },
    ],
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    website: {
        type: String,
        trim: true,
        default: ""
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    locationName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        trim: true,
        default: ""
    },
    coordinates: {
        latitude: {
            type: Number,
            min: -90,
            max: 90,
            default: null
        },
        longitude: {
            type: Number,
            min: -180,
            max: 180,
            default: null
        }
    },
    nearByLocations: [
        {
            type: String,
            trim: true
        }
    ],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4,
    },
    mallType: [
        {
            type: String,
            required: true,
            trim: true,
            enum: ["Shopping Complex", "Department Store","Strip Mall","High Street Plaza"]
        }
    ],
    info: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    amenities: [
        {
            type: String,
            trim: true,
            enum: ["Parking", "Valet Parking", "Restrooms", "Wheelchair Accessible", "Wi-Fi", "ATM", "Concierge", "Lost & Found", "Changing Rooms"]
        }
    ],
    shoppingDepartments: [
        {
            type: String,
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
        }
    ],
    hasWeddingShopping: {
        type: Boolean,
        default: false
    },
    closed: {
        type: Boolean,
        default: false,
    },
    totalStores: {
        type: Number,
        min: 0,
        default: 0
    },
    totalAreaSqFt: {
        type: Number,
        min: 0,
        default: 0
    },
    establishedDate: {
        type: Date
    },
    offersAvailable: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["pending", "active", "inactive",'approve'],
        default: "pending",
    },
    offer:[Offers],
    taxesAndCharges: [taxChargeSchema],
    operatingHours: {
            type: [OperatingHoursSchema],
    },
}, { timestamps: true });

module.exports = mongoose.model("Mall", MallSchema, "Malls");