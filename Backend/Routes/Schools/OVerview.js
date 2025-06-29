const {authenticateToken} = require('../../Controllers/Authorization/auth');
const School=require("../../models/Schools/School")
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Contact = require('../../models/Hospital/ContactUs');




router.get('/school/total',authenticateToken, async (req, res) => {
    try {
        const userEmail = req.user.email;

        const school = await School.findOne({ email: userEmail });
        console.log(school);
        if (!school) {
            return res.status(404).json({ msg: 'No associated School found for this authenticated user.' });
        }

        const totalMessages = await Contact.countDocuments({
            typeContact: school._id,
            typeOf: 'School'
        });

        res.json({ totalMessages });

    } catch (err) {
        console.error('Error fetching total contact messages for school:', err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/school/recent', authenticateToken, async (req, res) => {
    try {
        const userEmail = req.user.email;

        const school = await School.findOne({ email: userEmail });
        console.log(school);
        if (!school) {
            return res.status(404).json({ msg: 'No associated School found for this authenticated user.' });
        }

        const recentMessages = await Contact.find({
            typeContact: school._id,
            typeOf: 'School'
        })
        .sort({ createdAt: -1 })
        .limit(10);

        res.json(recentMessages);

    } catch (err) {
        console.error('Error fetching recent contact messages for school:', err.message);
        res.status(500).send('Server Error');
    }
});



router.put('/school/details', authenticateToken, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const {
            name,
            image,
            gallery,
            location,
            rating,
            info,
            foundationYear,
            mobileNumber,
            hostel,
            awards,
            coordinates,
            schoolDetails
        } = req.body;

        const school = await School.findOne({ email: userEmail});

        if (!school) {
            return res.status(404).json({ msg: 'No school found for this user.' });
        }
        if (name) school.name = name;
        if (image) school.image = image;
        if (gallery) school.gallery = gallery;
        if (location) school.location = location;
        if (rating !== undefined) school.rating = rating;
        if (info) school.info = info;
        if (foundationYear) school.foundationYear = foundationYear;
        if (mobileNumber) school.mobileNumber = mobileNumber;
        if (hostel !== undefined) school.hostel = hostel;
        if (awards) school.awards = awards;
        if (coordinates) {
            if (coordinates.latitude !== undefined) school.coordinates.latitude = coordinates.latitude;
            if (coordinates.longitude !== undefined) school.coordinates.longitude = coordinates.longitude;
        }

        if (schoolDetails) {
            if (schoolDetails.board) school.schoolDetails.board = schoolDetails.board;
            if (schoolDetails.specialTraining) school.schoolDetails.specialTraining = schoolDetails.specialTraining;
            if (schoolDetails.extraCurricularActivities) school.schoolDetails.extraCurricularActivities = schoolDetails.extraCurricularActivities;
            if (schoolDetails.transportation) school.schoolDetails.transportation = schoolDetails.transportation;
        }

        await school.save();

        res.json({ msg: 'School details updated successfully', school });

    } catch (err) {
        console.error('Error updating school details:', err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;