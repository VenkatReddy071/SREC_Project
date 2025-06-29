const Hospital =require("../models/Hospital/Hospital")
const Article=require("../models/Hospital/Articles");
const mongoose=require("mongoose");
const MONGODB_URI ="mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/SREC?retryWrites=true&w=majority&appName=SREC"; // REPLACE WITH YOUR MONGODB URI
const School=require("../models/Schools/School");
async function createTeachersForAllInstitutes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        
        const user=await School.findById('684fbdaf52855f347901d8f4');
        user.email="venkatreddy548@gmail.com";
        await user.save();
        console.log(user);
    }
    catch(error){
        console.log(error);
    }
}

createTeachersForAllInstitutes()