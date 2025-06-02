const mongoose = require("mongoose");

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
    nearByLocation: { 
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "accept"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema,"Hospitals");