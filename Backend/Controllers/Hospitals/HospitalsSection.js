const express = require("express");
const multer = require("multer");
const path = require("path");
const Hospital = require("../../models/Hospital/Hospital"); // Assuming this is your Mongoose model
const historyLogRecorder = require("../../Utilities/HistoryLogs");
const createNotifications = require("../../Utilities/NotifyLogs");
const Doctor=require("../../models/Hospital/Doctoer");
const {authenticateToken}=require("../Authorization/auth")
const { uploadHospitalData } = require('../../Utilities/multerConfig');
const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Only image files (jpeg, jpg, png, gif) are allowed!"));
        }
    }
});


const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/documents/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-doc-" + file.originalname);
    }
});

const uploadDocument = multer({
    storage: documentStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // Allow images and PDF for documents
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Only image (jpeg, jpg, png) and PDF files are allowed for documents!"));
        }
    }
});

// --- Multer Storage Configuration for Doctor Images ---
const doctorImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/doctors/"); // Store doctor images in a dedicated 'uploads/doctors' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-doctor-" + file.originalname);
    }
});

const uploadDoctorImage = multer({
    storage: doctorImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for doctor images
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Only image files (jpeg, jpg, png, gif) are allowed for doctor images!"));
        }
    }
});

router.post(
    "/addNew/Hospital",
    uploadHospitalData.fields([
        { name: "hospitalImage", maxCount: 1 },
        { name: "hospitalGallery", maxCount: 5 },
        { name: "glimpseInside", maxCount: 5 }, // For Step 2 data
        { name: "hospitalLicense", maxCount: 1 },
        { name: "verificationDocument", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const {
                name,
                locationName,
                address, // New from frontend
                phoneNumber,
                ownerEmail,
                specialization, // JSON string from frontend
                info,
                foundation,
                nearByLocation,
                // Fields from Step 2 of frontend
                patientSatisfaction,
                successRate,
                ProceduresAnnually,
                ambulance,
                verificationDocumentType // Text field for document type
            } = req.body;

            console.log("Request Body:", req.body);
            console.log("Request Files:", req.files);

            // Access uploaded files
            const hospitalImageFile = req.files && req.files.hospitalImage ? req.files.hospitalImage[0] : null;
            const hospitalGalleryFiles = req.files && req.files.hospitalGallery ? req.files.hospitalGallery : [];
            const glimpseInsideFiles = req.files && req.files.glimpseInside ? req.files.glimpseInside : [];
            const hospitalLicenseFile = req.files && req.files.hospitalLicense ? req.files.hospitalLicense[0] : null;
            const verificationDocumentFile = req.files && req.files.verificationDocument ? req.files.verificationDocument[0] : null;

            // --- Basic Validation ---
            if (!name || !locationName || !ownerEmail || !info || !nearByLocation || !phoneNumber || !address) {
                return res.status(400).json({ message: "Missing required hospital basic details." });
            }
            if (!hospitalImageFile) {
                return res.status(400).json({ message: "Hospital main image is required." });
            }
            if (hospitalGalleryFiles.length === 0) {
                return res.status(400).json({ message: "At least one hospital gallery image is required." });
            }
            if (!hospitalLicenseFile) {
                return res.status(400).json({ message: "Hospital license document is required." });
            }
            if (!verificationDocumentType || !verificationDocumentFile) {
                return res.status(400).json({ message: "Verification document type and file are required." });
            }

            // Validate Step 2 fields that are also sent in this request
            if (!patientSatisfaction || isNaN(patientSatisfaction) || patientSatisfaction < 0 || patientSatisfaction > 100) {
                return res.status(400).json({ message: "Patient Satisfaction Rate (0-100) is required and must be a number." });
            }
            if (!successRate || isNaN(successRate) || successRate < 0 || successRate > 100) {
                return res.status(400).json({ message: "Success Rate (0-100) is required and must be a number." });
            }
            if (!ProceduresAnnually || isNaN(ProceduresAnnually) || ProceduresAnnually < 0) {
                return res.status(400).json({ message: "Procedures Annually must be a non-negative number." });
            }
            if (glimpseInsideFiles.length === 0) {
                return res.status(400).json({ message: "At least one 'glimpse inside' image is required." });
            }

            // Check for existing hospital by owner email
            const find = await Hospital.findOne({ ownerEmail });
            if (find) {
                return res.status(409).json({ message: "Hospital with this owner email already exists." });
            }

            // --- Process Data ---
            let parsedSpecialization = [];
            if (specialization) {
                try {
                    const parsed = JSON.parse(specialization);
                    if (Array.isArray(parsed)) {
                        parsedSpecialization = parsed.map(s => s.trim()).filter(s => s.length > 0);
                    } else if (typeof parsed === 'string') {
                        parsedSpecialization = parsed.split(",").map(s => s.trim()).filter(s => s.length > 0);
                    }
                } catch (e) {
                    console.warn("Could not parse specialization as JSON, attempting as direct string.");
                    parsedSpecialization = specialization.split(",").map(s => s.trim()).filter(s => s.length > 0);
                }
            }

            let parsedFoundationDate = null;
            if (foundation) {
                const date = new Date(foundation);
                if (isNaN(date.getTime())) {
                    return res.status(400).json({ message: "Invalid foundation date format." });
                }
                parsedFoundationDate = date;
            }

            // Get paths from uploaded files
            const imagePath = hospitalImageFile.path;
            const galleryPaths = hospitalGalleryFiles.map((file) => file.path);
            const glimpseInsidePaths = glimpseInsideFiles.map((file) => file.path);
            const hospitalLicensePath = hospitalLicenseFile.path;
            const verificationDocumentPath = verificationDocumentFile.path;

            // --- Create New Hospital Document ---
            const newHospital = new Hospital({
                name: name,
                image: imagePath,
                gallery: galleryPaths,
                locationName: locationName,
                address: address, // Store address
                ownerEmail: ownerEmail,
                info: info,
                specialization: parsedSpecialization,
                foundation: parsedFoundationDate,
                nearByLocation: nearByLocation,
                phoneNumber,
                patientSatisfaction: parseFloat(patientSatisfaction), // Convert to number
                successRate: parseFloat(successRate), // Convert to number
                ProceduresAnnually: parseInt(ProceduresAnnually, 10), // Convert to integer
                ambulance: ambulance, // Boolean
                documents: {
                    hospitalLicense: hospitalLicensePath,
                    verificationDocumentType: verificationDocumentType,
                    verificationDocument: verificationDocumentPath,
                },
                glimpseInside: glimpseInsidePaths, // Store glimpse inside images
            });

            await newHospital.save();

            // --- Logging and Notifications ---
            console.log(req.session.user); // Assuming session user is available
            await historyLogRecorder(
                req,
                newHospital.constructor.modelName,
                "CREATE",
                "POST",
                newHospital._id,
                `New hospital '${newHospital.name}' added with ID ${newHospital._id}`
            );

            await createNotifications({
                userId: req.session?.user?.id, // Use optional chaining for safety
                dashboardType: ["AdminDashboard", "HospitalDashboard"],
                type: "success",
                title: "New Hospital Added",
                message: `Hospital '${newHospital.name}' details and documents saved successfully.`,
                link: `/hospitals/${newHospital._id}`,
            });

            res.status(201).json({
                message: "Hospital details, images, and documents saved successfully. Proceed to next step (Terms & Conditions).",
                hospitalId: newHospital._id,
                hospital: newHospital
            });

        } catch (error) {
            console.error("Error adding new hospital:", error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            // Multer errors
            if (error.message.includes("Invalid file type") || error.message.includes("File too large")) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Failed to add hospital due to an internal server error. Please try again later." });
        }
    }
);
router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const queryConditions = [];

        if (req.query.searchTerm) {
            const searchRegex = new RegExp(req.query.searchTerm, 'i'); // Case-insensitive regex
            queryConditions.push({
                $or: [
                    { name: searchRegex },
                    { locationName: searchRegex }
                ]
            });
        }

        // 2. Specialization OR Services (matching against specialization or services array)
        if (req.query.specialization) {
            const specialtiesArray = req.query.specialization.split(',');
            const specializationRegexes = specialtiesArray.map(s => new RegExp(s.trim(), 'i')); // Case-insensitive regex for each
            queryConditions.push({
                $or: [
                    { specialization: { $in: specializationRegexes } }, // Match in specialization array
                    { services: { $in: specializationRegexes } }       // Match in services array
                ]
            });
        }

        // 3. Minimum Rating
        if (req.query.minRating) {
            const minRating = parseFloat(req.query.minRating);
            if (!isNaN(minRating)) {
                queryConditions.push({ rating: { $gte: minRating } });
            }
        }

        // 4. Ambulance Filter
        if (req.query.ambulance === 'true') {
            queryConditions.push({ ambulance: true });

        }
        queryConditions.push({status:{$ne:"Pending"}})

        // Combine all conditions using $and if there are multiple.
        // If only one condition, it's directly used. If no conditions, it's an empty object.
        const finalFindQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};

        const hospitals = await Hospital.find(finalFindQuery)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalCount = await Hospital.countDocuments(finalFindQuery);
        const hasMore = (page * limit) < totalCount;

        if (!hospitals || hospitals.length === 0) {
            return res.status(200).json({ hospitals: [], message: "No more data found", hasMore: false });
        }

        try {
            await historyLogRecorder(
                req,
                "Hospital",
                "READ",
                "GET",
                hospitals[0]?._id,
                `User fetched hospital details with filters (page ${page}, limit ${limit}).`
            );
        } catch (logError) {
            console.error("Error logging action:", logError);
        }

        return res.status(200).json({
            hospitals: hospitals,
            hasMore: hasMore,
            currentPage: page,
            limit: limit,
            totalCount: totalCount
        });
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        return res.status(500).json({
            error: "An error occurred while fetching data.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
            hasMore: false
        });
    }
});



router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.params)
    try {
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found." });
        }
        return res.status(200).json({ message: "Hospital found successfully.", hospital });

    } catch (error) {
        console.error("Error fetching hospital by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid hospital ID format. Please provide a valid ID." });
        }
        return res.status(500).json({ message: "An internal server error occurred while fetching the hospital." });
    }
});



router.get("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Hospital ID from URL:", id);
        const { doctorId } = req.query;
        console.log("Doctor ID from query:", doctorId);

        const hospital = await Hospital.findById(id).select('services');

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const doctors = await Doctor.find({ Hospital: id });

        const selectedDoctor = doctors.find((doctor) => doctor?._id.toString() === doctorId);

        let message = '';

        if (!selectedDoctor) {
            message = "Doctor not found matching the provided doctorId";
        } else {
            message = "Success";
        }

        const result = {
            hospital,
            doctors,
            selectedDoctor
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in /book/:id route:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/email/doctors",authenticateToken, async (req, res) => {
    try {
        const {email}=req.user
        const hospital = await Hospital.find({ownerEmail:email}).select('specialization');

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const doctors = await Doctor.find({ Hospital: hospital[0]?._id });

        

        const result = {
            hospital,
            doctors,
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in /book/:id route:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
router.get("/hospital/email",authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        console.log(email);
        const hospital = await Hospital.find({ownerEmail:email});

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        console.log(hospital)
        const doctors = await Doctor.find({ Hospital:hospital[0]?._id });
        const result = {
            hospital,
            doctors,
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in /book/:id route:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/services/list",authenticateToken,async(req,res)=>{
    try{
    const {email}=req.user;
    const hospital=await Hospital.findOne({ownerEmail:email})
    if(!hospital){
        return res.status(400).json({message:"no hospital found"});
    }
    return res.status(200).json(hospital);
    }
    catch(error){
        return res.status(404).json({message:"server error",error});
    }
})

router.post('/:hospitalId/services', authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const { serviceName } = req.body;
        if (!serviceName || typeof serviceName !== 'string' || serviceName.trim() === '') {
            return res.status(400).json({ message: 'Service name is required and must be a non-empty string.' });
        }
        const hospital = await Hospital.findOne({ownerEmail:email});

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }
        const updatedHospital = await Hospital.findOneAndUpdate(
            {ownerEmail:email},
            { $addToSet: { services: serviceName.trim() } },
            { new: true, runValidators: true }
        );

        if (!updatedHospital) {
            return res.status(404).json({ message: 'Hospital not found after update attempt.' });
        }

        res.status(200).json({
            message: 'Service added successfully.',
            hospital: updatedHospital,
            addedService: serviceName.trim()
        });

    } catch (error) {
        console.error('Error adding service:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid hospital ID format.' });
        }
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});



router.put('/services/:serviceName', authenticateToken, async (req, res) => {
    try {
        const {serviceName } = req.body;
        const {email}=req.user;

        const hospital = await Hospital.findOne({ownerEmail:email});

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }
        if (!hospital.services.includes(serviceName)) {
            return res.status(404).json({ message: `Service "${serviceName}" not found in hospital's services.` });
        }
        const updatedHospital = await Hospital.findOneAndUpdate(
            {ownerEmail:email},
            { $pull: { services: serviceName } },
            { new: true }
        );

        if (!updatedHospital) {
            return res.status(404).json({ message: 'Hospital not found after update attempt.' });
        }

        res.status(200).json({
            message: 'Service deleted successfully.',
            hospital: updatedHospital,
            deletedService: serviceName
        });

    } catch (error) {
        console.error('Error deleting service:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid hospital ID format.' });
        }
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.put('/services/:serviceName', authenticateToken, async (req, res) => {
    try {
        const { serviceName, original } = req.body;
        const { email } = req.user;
        const hospital = await Hospital.findOne({ ownerEmail: email });

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }
        if (!hospital.services.includes(original)) {
            return res.status(404).json({ message: `Service "${original}" not found in hospital's services.` });
        }
        if (hospital.services.includes(serviceName) && original !== serviceName) {
            return res.status(409).json({ message: `Service "${serviceName}" already exists.` });
        }

        const serviceIndex = hospital.services.indexOf(original);

        hospital.services[serviceIndex] = serviceName;
        const updatedHospital = await hospital.save();

        res.status(200).json({
            message: `Service "${original}" updated to "${serviceName}" successfully.`,
            hospital: updatedHospital,
            updatedService: serviceName
        });

    } catch (error) {
        console.error('Error updating service:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid data format.' });
        }
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get("/outlet/email",authenticateToken, async(req,res)=>{
    try {
        const { email } = req.user;
        console.log(email);
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({message: "Invalid email format."});
        }

        const mall = await Hospital.findOne({ ownerEmail: email.toLowerCase() }).select("name email phoneNumber locationName address");

        if (!mall) {
            return res.status(404).json({message:"Mall not found with the provided email."});
        }
        res.status(200).json({
            success: true,
            message: "Mall fetched successfully!",
            mall: mall,
        });
    } catch (error) {
        return res.status(400).json({message:"Failed to fetch mall and products by email.", error});
    }
})

router.get("/profile/email",authenticateToken, async(req,res)=>{
    try {
        const { email } = req.user;
        console.log(email);
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({message: "Invalid email format."});
        }

        const mall = await Hospital.findOne({ ownerEmail: email.toLowerCase() })

        if (!mall) {
            return res.status(404).json({message:"Mall not found with the provided email."});
        }
        res.status(200).json({
            success: true,
            message: "Mall fetched successfully!",
            mall: mall,
        });
    } catch (error) {
        return res.status(400).json({message:"Failed to fetch mall and products by email.", error});
    }
})

router.put('/profile',authenticateToken, async (req, res) => {
    try {
        const {
            name, image, gallery, phoneNumber, patientSatisfaction, successRate,
            ProceduresAnnually, glimpseInside, locationName, address, rating,
            services, ambulance, info, specialization, foundation, coordinates,
            nearByLocation, status, operatingHours, isOffer
        } = req.body;
        const email=req.user.email;
        const hospital = await Hospital.findOne({ownerEmail:email});

        if (!hospital) {
            return res.status(404).json({ msg: 'Hospital profile not found.' });
        }

        hospital.name = name || hospital.name;
        hospital.image = image || hospital.image;
        hospital.gallery = gallery || hospital.gallery;
        hospital.phoneNumber = phoneNumber || hospital.phoneNumber;
        hospital.patientSatisfaction = patientSatisfaction !== undefined ? patientSatisfaction : hospital.patientSatisfaction;
        hospital.successRate = successRate !== undefined ? successRate : hospital.successRate;
        hospital.ProceduresAnnually = ProceduresAnnually !== undefined ? ProceduresAnnually : hospital.ProceduresAnnually;
        hospital.glimpseInside = glimpseInside || hospital.glimpseInside;
        hospital.locationName = locationName || hospital.locationName;
        hospital.address = address || hospital.address;
        hospital.rating = rating !== undefined ? rating : hospital.rating;
        hospital.services = services || hospital.services;
        hospital.ambulance = ambulance !== undefined ? ambulance : hospital.ambulance;
        hospital.info = info || hospital.info;
        hospital.specialization = specialization || hospital.specialization;
        hospital.foundation = foundation || hospital.foundation;
        hospital.coordinates = coordinates || hospital.coordinates;
        hospital.nearByLocation = nearByLocation || hospital.nearByLocation;
        hospital.status = status || hospital.status;
        hospital.operatingHours = operatingHours || hospital.operatingHours;
        hospital.isOffer = isOffer !== undefined ? isOffer : hospital.isOffer;

        await hospital.save();
        res.json(hospital);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;