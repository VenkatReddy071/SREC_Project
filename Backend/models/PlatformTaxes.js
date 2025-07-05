 const mongoose = require('mongoose');
 const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  applicableTo: {
    type: String,
    required: true,
    enum: ['all', 'restaurant', 'fashion', 'hospital'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tax', taxSchema);