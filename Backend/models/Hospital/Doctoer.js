const mongoose=require("mongoose");

const doctor= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    specialization:{
        type:[String],
        required:true,
    },
    Hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospitals",
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    operationSuccessRate:{
        type:String,
    },
    isAvaliable:{
        type:Boolean,
        required:true
    },
    degree:{
        type:String,
        required:true
    }
    
},{timestamps: true,})
module.exports=mongoose.model("Doctor",doctor,"Doctors")