const mongoose =require('mongoose');

const ProductSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  description: {
    type: String,
    trim: true,
  },
  priceINR: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  productType: {
    type: String,
    enum: ['menu_item', 'mandi_item', 'tiffin_item'],
    required: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    match: [/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/, 'Please use a valid URL for the product image.'],
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isTopSeller: {
    type: Boolean,
    default: false,
  },
  rating:{
    type:Number,
    default: 3,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Menu', ProductSchema);

module.exports= Product;
