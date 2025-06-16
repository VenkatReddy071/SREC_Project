const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  experienceYears: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  subjectsTaught: [
    {
      type: String,
      trim: true,
    },
  ],
  educationalQualifications: [
    {
      degree: { type: String, trim: true, required: true },
      university: { type: String, trim: true, required: true },
      year: { type: Number, required: true },
    },
  ],
  certifications: [
    {
      name: { type: String, trim: true, required: true },
      issuingBody: { type: String, trim: true },
      issueDate: { type: Date },
    },
  ],
  employeeId: {
    type: String,
    unique: true,
    required: false,
    trim: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  educationalInstitute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationalInstitute",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Teacher", teacherSchema);
