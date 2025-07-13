const mongoose = require("mongoose");

const historyLogSchema = new mongoose.Schema({
  email: {
    type:String,
    required:true,
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
    enum: ["Notification", "Hospital", "School", "College", "Fashion", "AdminDashboard","Restaurant"], 
  },
  action: {
    type: String,
    required: true,
    enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "OTHER"],
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  }
});

module.exports = mongoose.model("HistoryLog", historyLogSchema);
