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
    openingHours: {
        type: String,
        trim: true,
        default: "10:00 AM - 10:00 PM"
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
        enum: ["pending", "active", "inactive"],
        default: "pending",
    },
    offer:[Offers]
}, { timestamps: true });

module.exports = mongoose.model("Mall", MallSchema, "Malls");