
const mongoose = require("mongoose");

const ContactFormSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    typeContact: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "typeOf",
        required: true,
    },
    typeOf: {
        type: String,
        required: true,
        enum: ["Hospital", "EducationalInstitute"],
    },
}, { timestamps: true });

const Contact = mongoose.model("Contact", ContactFormSchema);

module.exports=Contact;