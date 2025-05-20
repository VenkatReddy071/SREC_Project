const mongoose=require("mongoose");
const Review=new mongoose({
    username:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    rating:{
        type:String,
        required:true,
    },
    school:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"School",
        required:true,
    },
    comments:[
        {type:String},
    ],
    like:{
        type:Number,
        default:0,
    },
},{timestamps: true,})
modules.export=mongoose.model("ReviewSchool",Review)