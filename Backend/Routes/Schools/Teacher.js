const express = require("express");
const router = express.Router();
const Teacher = require("../../models/Schools/Teacher");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: 'i' };
    }
    if (req.query.mobileNumber) {
      filter.mobileNumber = req.query.mobileNumber;
    }
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    if (req.query.specialization) {
      filter.specialization = { $regex: req.query.specialization, $options: 'i' };
    }
    if (req.query.minExperience) {
      filter.experienceYears = { ...filter.experienceYears, $gte: parseInt(req.query.minExperience) };
    }
    if (req.query.maxExperience) {
      filter.experienceYears = { ...filter.experienceYears, $lte: parseInt(req.query.maxExperience) };
    }
    if (req.query.educationalInstituteId) {
        if (!mongoose.Types.ObjectId.isValid(req.query.educationalInstituteId)) {
            return res.status(400).json({ message: "Invalid Educational Institute ID format" });
        }
        filter.educationalInstitute = req.query.educationalInstituteId;
    }
    if (req.query.subject) {
        filter.subjectsTaught = { $in: [req.query.subject] };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("educationalInstitute", "name institutionType location");

    const totalTeachers = await Teacher.countDocuments(filter);
    const totalPages = Math.ceil(totalTeachers / limit);

    res.status(200).json({
      total: totalTeachers,
      page: page,
      limit: limit,
      totalPages: totalPages,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Failed to retrieve teachers", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("educationalInstitute", "name institutionType location");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email }).populate("educationalInstitute", "name institutionType location");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found with this email" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher by email:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/by-institute/:instituteId", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.instituteId)) {
            return res.status(400).json({ message: "Invalid Educational Institute ID format" });
        }
        const teachers = await Teacher.find({ educationalInstitute: req.params.instituteId }).populate("educationalInstitute", "name institutionType location");
        if (teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found for this educational institute" });
        }
        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers by institute ID:", error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/by-institute-and-email/:instituteId/:email", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.instituteId)) {
            return res.status(400).json({ message: "Invalid Educational Institute ID format" });
        }
        const teacher = await Teacher.findOne({
            educationalInstitute: req.params.instituteId,
            email: req.params.email
        }).populate("educationalInstitute", "name institutionType location");
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found with this email for the specified institute" });
        }
        res.status(200).json(teacher);
    } catch (error) {
        console.error("Error fetching teacher by institute and email:", error);
        res.status(500).json({ message: error.message });
    }
});


router.post("/", async (req, res) => {
  try {
    const teacher = new Teacher({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address,
      experienceYears: req.body.experienceYears,
      specialization: req.body.specialization,
      subjectsTaught: req.body.subjectsTaught,
      educationalQualifications: req.body.educationalQualifications,
      certifications: req.body.certifications,
      employeeId: req.body.employeeId,
      dateOfJoining: req.body.dateOfJoining,
      profileImage: req.body.profileImage,
      educationalInstitute: req.body.educationalInstitute,
    });
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    Object.keys(req.body).forEach((key) => {
      teacher[key] = req.body[key];
    });

    const updatedTeacher = await teacher.save();
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    await Teacher.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;