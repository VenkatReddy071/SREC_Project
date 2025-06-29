
const Contact=require("../../models/Hospital/ContactUs");
const express = require("express");
const router = express.Router();
const {authenticateToken}=require("../../Controllers/Authorization/auth")
const Hospital=require("../../models/Hospital/Hospital");
const School=require("../../models/Schools/School");
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().populate('typeContact');
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
});

router.get("/hospital/contacts",authenticateToken,async(req,res)=>{
    try{
        const email=req.user.email;
        const hospital=await Hospital.findOne({ownerEmail:email});
        const contact=await Contact.find({typeContact:hospital?._id});
        return res.status(200).json({contact});
    }
    catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }

})

router.get("/school/contacts",authenticateToken,async(req,res)=>{
    console.log('hellp')
    try{
        const email=req.user.email;
        const hospital=await School.findOne({email:email});
        console.log(hospital);
        const contact=await Contact.find({typeContact:hospital?._id});
        console.log(contact);
        return res.status(200).json({contact});
    }
    catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }

})
router.get("/user", async (req, res) => {
  try {
    const userId = req.user.id;
    res.status(200).json({ message: "This route would return contacts specific to the authenticated user if the schema supported it.", userId: userId });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's contacts", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, message, typeContact, typeOf } = req.body.contactDetails;
    const userid=req.session?.user?.id;
    console.log(req.body.contactDetails);
    if(!userid){
        return res.status(400).json({message:"Authorization required !."});
    }
    const newContact = new Contact({
      userId:userid,
      name,
      email,
      message,
      typeContact,
      typeOf,
    });

    await newContact.save();
    res.status(200).json({ message: "Contact form submitted successfully", contact: newContact });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      res.status(400).json({ message: "Validation error", errors: errors });
    } else {
      res.status(500).json({ message: "Error submitting contact form", error: error.message });
    }
  }
});

module.exports = router;
