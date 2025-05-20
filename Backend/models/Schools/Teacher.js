const mongoose=require("mongoose");

const Teacher=new mongoose({
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
    School:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"School",
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    

},{timestamps: true,})
modules.export=mongoose.model("Teacher",Teacher)