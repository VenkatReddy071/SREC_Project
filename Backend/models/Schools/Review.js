const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  educationalInstitute: {
    type: mongoose.Schema.Types.ObjectId,
    refPath:'modelType',
    required: true,
  },
  modelType:{
    type:String,
    required:true,
    eum:["EducationalInstitute","Hospital","Restaurant","Mall"]
  },
  comment: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Review", reviewSchema);
