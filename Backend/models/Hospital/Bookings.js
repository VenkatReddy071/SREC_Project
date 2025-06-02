const mongoose=require("mongoose");

const Booking=new mongoose({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    slot:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date,
    },
    Hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true,
    },
    Doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true,
    },
    offer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Offer",
    },
    age:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:['male','female','others'],
        required:true,
    },
    mobilenumber:{
        type:String,
        required:true,
    },


},{timestamps: true,})

module.exports=mongoose.model("Booking",Booking)