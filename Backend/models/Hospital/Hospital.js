const mongoose=require("mongoose");

const hospitalSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    gallery:[
        {
            type:String,
        },
    ],
    location:{
        type:String,
        required:true,
    },
    rating:{
        type:String,
        min:0,
        max:5,
        default:4,
    },
    info:{
        type:String,

    },
    specialization:[
        {type:String,}
    ],
    foundation:{
        type:Date()
    },
    nearByLocation:{
        type:String,
    },
    mobilenumber:{
        type:String,
        required:true,
    }
},{timestamps: true,})
modules.export=mongoose.model("Hospital",hospitalSchema)