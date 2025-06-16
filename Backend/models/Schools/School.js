const mongoose = require("mongoose");

const educationalInstituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  institutionType: {
    type: String,
    enum: ["School", "College"],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  gallery: [
    {
      type: String,
    },
  ],
  location: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4,
  },
  info: {
    type: String,
    trim: true,
  },
  foundationYear: {
    type: Number,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  hostel: {
    type: Boolean,
    default: false,
  },
   awards: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      year: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
  ],

  schoolDetails: {
    board: {
      type: String,
      enum: ["CBSE", "ICSE", "BSEAP", "Other State Board", "International"],
    },
    specialTraining: {
      type: String,
    },
    extraCurricularActivities: [
      { type: String },
    ],
    transportation: {
      type: String,
    },
  },


  collegeDetails: {
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    affiliationType: {
      type: String,
      enum: ["University", "Autonomous", "Deemed University", "Affiliated College", "Other"],
    },
    courseTypes: [
      { type: String, trim: true }
    ],
    extraCurricularActivities: [
      { type: String },
    ],
    transportation: {
      type: String,
    },
  }
}, {
  timestamps: true
});

educationalInstituteSchema.pre('save', function (next) {
  if (this.institutionType === 'School') {
    this.collegeDetails = undefined;
  } else if (this.institutionType === 'College') {
    this.schoolDetails = undefined;
  }
  next();
});

module.exports = mongoose.model("EducationalInstitute", educationalInstituteSchema);
