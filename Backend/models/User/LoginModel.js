const mongoose = require("mongoose");
const bcrypt=require("bcryptjs")
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "user",
        "admin",
        "marketing",
        "hospital",
        "fashion",
        "school",
        "college",
        "restaurant",
      ],
      default: "user",
    },
    otp: {
      type: String,
      default:null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    otpType: {
        type: String,
        enum: ['email_verify', 'password_reset', "forgot_password",null],
        default: null,
    },
    subscribe:{
      type:Boolean,
      default:false,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
