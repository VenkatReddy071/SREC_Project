// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         unique: true
//     },
//     items: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//                 required: true
//             },
//             name: {
//                 type: String,
//                 required: true
//             },
//             image: {
//                 type: String
//             },
//             price: {
//                 type: Number,
//                 required: true,
//                 min: 0
//             },
//             currency: {
//                 type: String,
//                 required: true
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 min: 1,
//                 default: 1
//             },
//             selectedSize: {
//                 type: String,
//                 trim: true
//             },
//             selectedColor: {
//                 type: String,
//                 trim: true
//             },
//             mall: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Mall',
//                 required: true
//             },
//             storeName: {
//                 type: String,
//                 required: true,
//                 trim: true
//             }
//         },
//         { _id: false }
//     ],
//     totalPrice: {
//         type: Number,
//         required: true,
//         default: 0,
//         min: 0
//     }
// }, { timestamps: true });

// module.exports = mongoose.model("Cart", CartSchema, "Carts");


const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemModelType',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        required: true,
        default: 'INR'
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      itemModelType: {
        type: String,
        required: true,
        enum: ['Menu', 'Product']
      },
      sourceType: {
        type: String,
        enum: ['Restaurant', 'Mall'],
        required: true
      },
      sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      selectedSize: {
        type: String,
        trim: true
      },
      selectedColor: {
        type: String,
        trim: true
      },
      storeName: {
        type: String,
        trim: true
      }
    },
    { _id: false }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema, "Carts");
