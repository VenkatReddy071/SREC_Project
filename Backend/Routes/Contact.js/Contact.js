
const Contact=require("../../models/Hospital/ContactUs");
const express = require("express");
const router = express.Router();
const {authenticateToken}=require("../../Controllers/Authorization/auth")
const Hospital=require("../../models/Hospital/Hospital");
const School=require("../../models/Schools/School");
const createNotifications=require("../../Utilities/UserNotification");
router.get("/", async (req, res) => {
  try {
    const { type, page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    let populateOptions = {};
    let totalContacts = 0;

    if (type === 'Hospital') {
      query = { typeOf: "Hospital" };
      populateOptions = {
        path: 'typeContact',
        select: "name image phoneNumber locationName address ownerEmail"
      };
    } else if (type === 'EducationalInstitute') {
      query = { typeOf: "EducationalInstitute" };
      populateOptions = {
        path: 'typeContact',
        select: "name image institutionType mobileNumber location schoolDetails collegeDetails email foundationYear"
      };
    } else {
      return res.status(400).json({ message: "Invalid or missing 'type' query parameter. Must be 'Hospital' or 'EducationalInstitute'." });
    }

    totalContacts = await Contact.countDocuments(query); // Get total count for pagination

    const contacts = await Contact.find(query)
      .populate(populateOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const hasMore = (skip + contacts.length) < totalContacts;

    res.status(200).json({
      contacts,
      totalContacts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalContacts / parseInt(limit)),
      hasMore
    });

  } catch (error) {
    console.error("Error fetching contacts:", error);
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
    await createNotifications({userId:userid,type:"contact_submission",title:`${typeOf}Contact Submission`,message:"Your Contact submission is successfull!,we are looking forword to you! "})
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
