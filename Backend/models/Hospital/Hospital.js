const mongoose = require("mongoose");



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


const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    patientSatisfaction: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    successRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    ProceduresAnnually: {
        type: Number,
        required: true,
        min: 0
    },
    glimpseInside: {
        type: [String],
        required: true,
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
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4,
    },
    ownerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    services: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    ambulance: {
        type: Boolean,
        required: true,
    },
    info: {
        type: String,
        required: true,
        trim: true
    },
    specialization: [
        {
            type: String,
            trim: true
        },
    ],
    foundation: {
        type: Date
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
    nearByLocation: { 
        type: String,
        required: true,
        trim: true
    },
    status:{
            type:String,
            enum:["Pending","Approve"],
            default:"Pending",
    },
    operatingHours:[OperatingHoursSchema],
    isOffer:{
        type:Boolean,
        default:false,
        enum:['24/7'],

    },
     documents: {
        hospitalLicense: { type: String },
        verificationDocumentType: { type: String },
        verificationDocument: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema,"Hospitals");