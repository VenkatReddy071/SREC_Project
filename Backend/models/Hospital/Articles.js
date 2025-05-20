const mongoose=require("mongoose");
const Article=new mongoose({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true,
    },
    info:{
        type:String,
        required:true,
    },
    publishedBy:{
        type:String,
    },

},{timestamps:true})

modules.export=mongoose.model("Article",Article);