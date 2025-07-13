
const mongoose = require('mongoose');

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
const RestaurantSchema = new mongoose.Schema({
    restaurantId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    description: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0,
    },
    address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, trim: true },
    },
    phone: {
        type: String,
        trim: true,
    },
    imageUrls: {
        mainImage: {
            type: String,
            trim: true,
            match: [/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/, 'Please use a valid URL for the main image.'],
        },
        galleryImages: [{
            type: String,
            trim: true,
            match: [/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/, 'Please use a valid URL for a gallery image.'],
        }],
        menuImages: [{
            type: String,
            trim: true,
            match: [/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/, 'Please use a valid URL for a menu image.'],
        }],
    },
    cuisine: [{
        type: String,
        trim: true,
    }],
    averagePriceINR: {
        type: Number,
        min: 0,
        default: 0,
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    isTopPick: {
        type: Boolean,
        default: false,
    },
    offersDelivery: {
        type: Boolean,
        default: false,
    },
    isTakeaway: {
        type: Boolean,
        default: false,
    },
    servesTiffins: {
        type: Boolean,
        default: false,
    },

    isTiffinOnly: {
        type: Boolean,
        default: false,
    },
    isVegetarian: {
        type: Boolean,
        default: false,
    },
    services: [{
        type: String,
        enum: ['Dine-in', 'WiFi', 'Parking', 'Outdoor Seating', 'Live Music', 'Private Dining', 'Takeaway', 'Delivery'],
        trim: true,
    }],
    seatingAvailability: [{
        type: {
            type: String,
            enum: ['table'],
        },
        capacity: {
            type: Number,
            min: 1,
        },
    }],
    closed: {
        type: Boolean,
        default: false,
    },
    operatingHours: {
        type: [OperatingHoursSchema],
    },
    offer: [Offers],
    status:{
        type:String,
        enum:["Pending","Approve"],
        default:"Pending",
    },
    taxesAndCharges: [taxChargeSchema],
    
}, {
    timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;