const Doctor = require("../../models/Hospital/Doctoer");
const mongoose = require("mongoose");
const express = require("express");
const fetchDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctors = await Doctor.find({ Hospital:id }).select(
      `name experience specialization image operationSuccessRate isAvaliable degree`
    );

    if (!doctors || doctors.length === 0) {
      console.log("6. No doctors found, sending 404 response.");
      return res.status(404).json({ message: `No doctors found for hospital ID: ${id}` });
    }

    console.log("7. Doctors found, sending 200 response.");
    return res.status(200).json(doctors);
  } catch (error) {
    console.error("8. Error caught in fetchDoctor:", error);
    if (error.name === 'CastError') {
        console.error("9. CastError caught: Invalid ObjectId provided for Hospital field.");
        return res.status(400).json({ message: "Invalid Hospital ID format.", error: error.message });
    }
    return res.status(500).json({ message: "An error occurred while fetching doctors.", error: error.message });
  }
};

const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("Hospital");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateDoctorPartial = async (req, res) => {
   const { id } = req.params;
    const {
        name,
        experience,
        phone,
        email,
        bio,
        operatingHours,
        regularHours,
        languages,
        specialization,
        image,
        operationSuccessRate,
        isAvaliable,
        degree,
        onleave,
        reason
    } = req.body;
    console.log(req.body);

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            {
                name,
                experience,
                phone,
                email,
                bio,
                operatingHours,
                regularHours,
                languages,
                specialization,
                image,
                operationSuccessRate,
                isAvaliable,
                onleave,
                reason
            },
            { new: true, runValidators: true } // `new: true` returns the updated doc; `runValidators: true` ensures schema validation
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        // Handle validation errors specifically if needed
        if (error.name === 'ValidationError' ) {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!deletedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: "Doctor deleted successfully",
            doctor: deletedDoctor
        });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update doctor's leave status
const updateDoctorLeaveStatus = async (req, res) => {
    try {
        const {
            onleave,
            reason
        } = req.body;

        if (typeof onleave === "undefined") {
            return res.status(400).json({ message: "Please provide 'onleave' status (true/false)" });
        }

        if (onleave === true && (!reason || reason.trim() === "")) {
            return res.status(400).json({ message: "Reason is required when doctor is on leave" });
        }
        const updateFields = { onleave };
        if (onleave === true) {
            updateFields.reason = reason;
        } else {
            updateFields.reason = undefined;
        }


        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            updateFields, { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: `Doctor leave status updated to ${onleave ? 'on leave' : 'available'}`,
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update doctor's regular hours
const updateDoctorRegularHours = async (req, res) => {
    try {
        const { regularHours } = req.body;

        if (!regularHours || regularHours.trim() === "") {
            return res.status(400).json({ message: "Please provide 'regularHours'" });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id, { regularHours }, { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: "Doctor's regular hours updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Error updating regular hours:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch doctors by hospital ID
const fetchDoctorsByHospitalId = async (req, res) => {
    try {
        const { id } = req.params;

        const doctors = await Doctor.find({ Hospital: id }).select(
            `name experience specialization image operationSuccessRate isAvaliable degree`
        );

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: `No doctors found for hospital ID: ${id}` });
        }

        return res.status(200).json(doctors);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Hospital ID format.", error: error.message });
        }
        return res.status(500).json({ message: "An error occurred while fetching doctors.", error: error.message });
    }
};

module.exports = { fetchDoctor,updateDoctorPartial  };