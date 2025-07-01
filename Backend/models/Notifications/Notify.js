const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  dashboardType: {
    type: [String],
    enum: ["AdminDashboard", "SchoolDashboard", "CollegeDashboard", "HospitalDashboard", "FashionDashboard"],
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["info", "warning", "error", "success", "update"],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
