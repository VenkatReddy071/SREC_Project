const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  review:{
    type:String,
    required:true
  },
  comments: [
    {
      type: String,
    },
  ],
  like: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
