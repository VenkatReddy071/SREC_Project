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
const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    slot: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    bookingDate:{
        type: Date,
        default:Date.now,
        required: true,
    },
    ScheduleDate: {
        type: Date,
        required: true,
    },
    specialization: {
        type: [String],
        required: true,
    },
    Hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    Doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
    },
    age: {
        type: Number, 
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    mobilenumber: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Completed', 'Cancelled','user_cancel'],
        default: 'Pending',
        required: true,
    },
    reasion:{
        type:String,
        required:function() { return this.orderStatus === "user_cancel"; },
    },
    favBooking:{
        type:Boolean,
        default:false,
    },
    subStatus:[subStatus]
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);