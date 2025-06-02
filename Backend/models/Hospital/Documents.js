const mongoose=require("mongoose");
const documentSchema=mongoose.Schema({
    license:{
        type:String,
        required:true,
    },
    hospital:{
        type:String,
        required:true,
    },
    idcard:{
        type:String,
    },
    proof:{
        type:String,
        required:true
    },
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true
    },

},{timestamps:true});

module.exports=mongoose.model("documentSchema",documentSchema,"Doctors");