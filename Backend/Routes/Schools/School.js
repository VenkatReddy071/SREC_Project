const express = require("express");
const router = express.Router();
const EducationalInstitute = require("../../models/Schools/School");
const {authenticateToken}=require("../../Controllers/Authorization/auth");
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.institutionType) {
      filter.institutionType = req.query.institutionType;
    }
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.minRating) {
      filter.rating = { ...filter.rating, $gte: parseInt(req.query.minRating) };
    }
    if (req.query.maxRating) {
      filter.rating = { ...filter.rating, $lte: parseInt(req.query.maxRating) };
    }
    if (req.query.hostel) {
      filter.hostel = req.query.hostel === 'true';
    }

    if (req.query.board && req.query.institutionType === 'School') {
      filter['schoolDetails.board'] = req.query.board;
    }
    if (req.query.specialization && req.query.institutionType === 'College') {
      filter['collegeDetails.specializations'] = { $in: [req.query.specialization] };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const institutes = await EducationalInstitute.find(filter)
      .skip(skip)
      .limit(limit);

    const totalInstitutes = await EducationalInstitute.countDocuments(filter);
    const totalPages = Math.ceil(totalInstitutes / limit);

    res.status(200).json({
      total: totalInstitutes,
      page: page,
      limit: limit,
      totalPages: totalPages,
      data: institutes,
    });
  } catch (error) {
    console.error("Error fetching educational institutes:", error);
    res.status(500).json({ message: "Failed to retrieve educational institutes", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const institute = await EducationalInstitute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: "Educational Institute not found" });
    }
    res.status(200).json(institute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/by-email/profile",authenticateToken, async (req, res) => {
  try {
    const {email}=req.user;
    const institute = await EducationalInstitute.findOne({email:email });
    if (!institute) {
      return res.status(404).json({ message: "Educational Institute not found with this mobile number" });
    }
    res.status(200).json({success: true,
            message: "Mall fetched successfully!",
            institution:institute
          });
  } catch (error) {
    console.error("Error fetching educational institute by mobile number:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const institute = new EducationalInstitute({
    name: req.body.name,
    institutionType: req.body.institutionType,
    image: req.body.image,
    gallery: req.body.gallery,
    location: req.body.location,
    rating: req.body.rating,
    info: req.body.info,
    foundationYear: req.body.foundationYear,
    mobileNumber: req.body.mobileNumber,
    hostel: req.body.hostel,
    awards: req.body.awards,
    schoolDetails: req.body.schoolDetails,
    collegeDetails: req.body.collegeDetails,
  });

  try {
    const newInstitute = await institute.save();
    res.status(201).json(newInstitute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const institute = await School.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: "Educational Institute not found" });
    }

    Object.keys(req.body).forEach((key) => {
      institute[key] = req.body[key];
    });

    const updatedInstitute = await institute.save();
    res.status(200).json(updatedInstitute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const institute = await School.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: "Educational Institute not found" });
    }
    await EducationalInstitute.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Educational Institute deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;