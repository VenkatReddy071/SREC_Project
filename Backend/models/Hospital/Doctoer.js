// const mongoose=require("mongoose");

// const doctor= new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//     },
//     experience:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     phone:{
//         type:Number,
//         required:true,
//     },
//     email:{
//         type:String,
//         required:true,
//     },
//     bio:{
//         type:String,
//         required:true,
//     },
//     operatingHours:{
//         type:String,
//         required:true,
//     },
//     languages:{
//         type:[String],
//         required:true,
//     },
//     specialization:{
//         type:[String],
//         required:true,
//     },
//     Hospital:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Hospitals",
//         required:true
//     },
//     image:{
//         type:String,
//         required:true,
//     },
//     operationSuccessRate:{
//         type:String,
//     },
//     isAvaliable:{
//         type:Boolean,
//         required:true
//     },
//     degree:{
//         type:String,
//         required:true
//     },
//     onleave:{
//         type:String,

//     },
//     reasion:{
//         type:String,
//     }
    
// },{timestamps: true,})
// module.exports=mongoose.model("Doctor",doctor,"Doctors")


const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        required: true,
    },
    operatingHours: {
        type: String,
        required: true,
    },
    regularHours: {
        type: String,
        required: false,
    },
    languages: {
        type: [String],
        required: true,
    },
    specialization: {
        type: [String],
        required: true,
    },
    Hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    operationSuccessRate: {
        type: String,
    },
    isAvaliable: {
        type: Boolean,
        required: true,
        default: true,
    },
    degree: {
        type: String,
        required: true
    },
    onleave: {
        type: Boolean,
        default: false,
    },
    reason: {
        type: String,
        required: function() { return this.onleave === true; }
    }

}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema, "Doctors");
