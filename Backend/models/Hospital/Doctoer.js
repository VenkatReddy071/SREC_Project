const mongoose=require("mongoose");

const doctor=new mongoose({
    name:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    specialization:{
        type:String,
        required:true,
    },
    Hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    operationSuccessRate:{
        type:String,
    },

},{timestamps: true,})
modules.export=mongoose.model("Doctor",doctor)