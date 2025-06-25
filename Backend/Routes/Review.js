const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Review = require("../models/Schools/Review");

const User = mongoose.model('User');
const EducationalInstitute = mongoose.model('EducationalInstitute');
const Hospital = mongoose.model('Hospital');
const Restaurant = mongoose.model('Restaurant');
const Mall = mongoose.model('Mall');

router.post("/", async (req, res) => {
    try {
        const { username, rating, educationalInstitute, modelType, comment } = req.body;

        if (!username || !rating || !educationalInstitute || !modelType) {
            return res.status(400).json({ message: "Missing required fields: username, rating, educationalInstitute (item ID), modelType." });
        }
        if (!mongoose.Types.ObjectId.isValid(username)) {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        if (!mongoose.Types.ObjectId.isValid(educationalInstitute)) {
            return res.status(400).json({ message: `Invalid ID format for ${modelType}.` });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }
        
        const allowedModelTypes = ["EducationalInstitute", "Hospital", "Restaurant", "Mall"];
        if (!allowedModelTypes.includes(modelType)) {
            return res.status(400).json({ message: `Invalid modelType. Must be one of: ${allowedModelTypes.join(', ')}` });
        }

        const userExists = await User.findById(username);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        let itemExists;
        switch (modelType) {
            case 'EducationalInstitute':
                itemExists = await EducationalInstitute.findById(educationalInstitute);
                break;
            case 'Hospital':
                itemExists = await Hospital.findById(educationalInstitute);
                break;
            case 'Restaurant':
                itemExists = await Restaurant.findById(educationalInstitute);
                break;
            case 'Mall':
                itemExists = await Mall.findById(educationalInstitute);
                break;
            default:
                return res.status(400).json({ message: "Unrecognized modelType for item existence check." });
        }

        if (!itemExists) {
            return res.status(404).json({ message: `${modelType} with ID ${educationalInstitute} not found.` });
        }

        const newReview = new Review({
            username,
            rating,
            educationalInstitute,
            modelType,
            comment
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/:modelType/:itemId", async (req, res) => {
    try {
        const { modelType, itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: `Invalid ${modelType} ID format.` });
        }

        const allowedModelTypes = ["EducationalInstitute", "Hospital", "Restaurant", "Mall"];
        if (!allowedModelTypes.includes(modelType)) {
            return res.status(400).json({ message: `Invalid modelType. Must be one of: ${allowedModelTypes.join(', ')}` });
        }

        const reviews = await Review.find({
            educationalInstitute: itemId,
            modelType: modelType
        })
        .populate('username', 'name email')
        .populate({
            path: 'educationalInstitute',
            model: modelType,
            select: 'name location address cuisine city'
        })
        .sort({ createdAt: -1 });

        if (reviews.length === 0) {
            return res.status(404).json({ message: `No reviews found for this ${modelType}.` });
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error(`Error fetching reviews for ${req.params.modelType} with ID ${req.params.itemId}:`, error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format." });
        }

        const reviews = await Review.find({ username: userId })
            .populate('username', 'name email')
            .populate({
                path: 'educationalInstitute',
                refPath: 'modelType',
                select: 'name location address cuisine city'
            })
            .sort({ createdAt: -1 });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this user." });
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error(`Error fetching reviews for user ID ${req.params.userId}:`, error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;