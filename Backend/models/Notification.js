const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["order_update", "new_message", "promotion", "contact_response", "system_alert", "other",'new_order',"new_appointment","appointment_update","contact_submission","new_booking"],
        default: "other",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    link: {
        type: String,
        trim: true,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
}, {
    timestamps: true
});

const Notification = mongoose.model("UserNotification", NotificationSchema);

module.exports = Notification;
