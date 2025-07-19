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
  reviewType: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "modelType",
    required: true,
  },
  modelType:{
    type:String,
    enum:["Hospital","Malls","Restaurant","EducationalInstitute"]
  },
  review:{
    type:String,
    required:true
  },
  like: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
