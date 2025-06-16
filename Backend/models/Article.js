const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 50,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  imageUrl: {
    type: String,
    trim: true,
  },
  relatedToId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemModelType',
        required: true
  },
  relatedToModel: {
    type: String,
    required: function() {
      return this.relatedToId != null;
    },
    enum: ["EducationalInstitute", "Teacher", "Hospital","Website"],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Article", articleSchema);
