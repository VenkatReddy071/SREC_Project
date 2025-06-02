const express = require("express");
const multer = require("multer");
const path = require("path");
const Hospital = require("../../models/Hospital/Hospital"); // Assuming this is your Mongoose model
const historyLogRecorder = require("../../Utilities/HistoryLogs");
const createNotifications = require("../../Utilities/NotifyLogs");

const router = express.Router();

// --- Multer Storage Configuration (General for images) ---
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/"); // Store images in a dedicated 'uploads/images' folder
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


// --- ROUTE 1: Add New Hospital (Step 1) ---
router.post(
    "/addNew/Hospital",
    uploadImage.fields([
        { name: "hospitalImage", maxCount: 1 },
        { name: "hospitalGallery", maxCount: 5 }
    ]),
    async (req, res) => {
        try {
        
            const {
                hospitalName,
                hospitalLocation,
                hospitalMobileNumber,
                ownerEmail,
                specialization, // This is expected as a JSON string from frontend
                hospitalInfo,
                hospitalFoundationDate,
                hospitalNearByLocation
            } = req.body;
            console.log(req.session)
            console.log(req.body, "body", req.files); // Log to debug incoming data

            if (!hospitalName || !hospitalLocation || !ownerEmail || !hospitalInfo || !hospitalNearByLocation || !hospitalMobileNumber) {
                return res.status(400).json({ message: "Missing required hospital fields." });
            }

            if (!req.files || !req.files.hospitalImage || req.files.hospitalImage.length === 0) {
                return res.status(400).json({ message: "Hospital image is required." });
            }

            const imagePath = req.files.hospitalImage[0].path;
            const galleryPaths = req.files.hospitalGallery ? req.files.hospitalGallery.map((file) => file.path) : [];

            const find = await Hospital.findOne({ ownerEmail });
            if (find) {
                return res.status(409).json({ message: "Hospital with this owner email already exists." });
            }

            let parsedSpecialization = [];
            // Parse specialization if it's a JSON string from frontend
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
            if (hospitalFoundationDate) {
                const date = new Date(hospitalFoundationDate);
                if (isNaN(date.getTime())) {
                    return res.status(400).json({ message: "Invalid foundation date format." });
                }
                parsedFoundationDate = date;
            }

            const newHospital = new Hospital({
                name: hospitalName,
                image: imagePath,
                gallery: galleryPaths,
                location: hospitalLocation,
                ownerEmail,
                info: hospitalInfo,
                specialization: parsedSpecialization,
                foundation: parsedFoundationDate,
                nearByLocation: hospitalNearByLocation,
                mobilenumber: hospitalMobileNumber,
            });

            await newHospital.save();
            console.log(req.session.user)
            await historyLogRecorder(
                req,
                newHospital.constructor.modelName,
                "CREATE",
                "POST",
                newHospital._id,
                `New hospital '${newHospital.name}' added with ID ${newHospital._id}`
            );  
            console.log(req.session.user)
            await createNotifications({
                userId:req.session.user.id,
                dashboardType: ["AdminDashboard", "HospitalDashboard"],
                type: "success",
                title: "New Hospital Added",
                message: `Hospital '${newHospital.name}' details saved. Please proceed to next steps.`,
                link: `/hospitals/${newHospital._id}`,
            });

            res.status(201).json({
                message: "Hospital details saved successfully. Proceed to next step.",
                hospitalId: newHospital._id, // Send back the ID for subsequent steps
                hospital: newHospital // Optionally send the full object
            });

        } catch (error) {
            console.error("Error adding new hospital:", error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes("Only image files") || error.message.includes("File too large")) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Failed to add hospital due to an internal server error. Please try again later." });
        }
    }
);

// // --- ROUTE 2: Upload Hospital Documents (Step 2) ---
// router.post(
//     "/uploadHospitalDocuments",
//     uploadDocument.fields([
//         { name: "hospitalLicense", maxCount: 1 },
//         { name: "verificationDocument", maxCount: 1 }
//     ]),
//     async (req, res) => {
//         try {
//             const { hospitalId, verificationDocumentType } = req.body;

//             if (!hospitalId) {
//                 return res.status(400).json({ message: "Hospital ID is required to upload documents." });
//             }

//             const hospital = await Hospital.findById(hospitalId);
//             if (!hospital) {
//                 return res.status(404).json({ message: "Hospital not found." });
//             }

//             const updateFields = {};
//             let isUpdateNeeded = false;

//             if (req.files && req.files.hospitalLicense && req.files.hospitalLicense.length > 0) {
//                 updateFields.hospitalLicense = req.files.hospitalLicense[0].path;
//                 isUpdateNeeded = true;
//             } else {
//                 return res.status(400).json({ message: "Hospital license document is required." });
//             }

//             if (req.files && req.files.verificationDocument && req.files.verificationDocument.length > 0) {
//                 if (!verificationDocumentType) {
//                     return res.status(400).json({ message: "Verification document type is required." });
//                 }
//                 updateFields.verificationDocument = {
//                     type: verificationDocumentType,
//                     path: req.files.verificationDocument[0].path
//                 };
//                 isUpdateNeeded = true;
//             } else {
//                 return res.status(400).json({ message: "Verification document is required." });
//             }

//             if (isUpdateNeeded) {
//                 await Hospital.findByIdAndUpdate(hospitalId, { $set: updateFields }, { new: true });
//             }

//             await historyLogRecorder(
//                 req,
//                 hospital.constructor.modelName,
//                 "UPDATE",
//                 hospital._id,
//                 `Documents uploaded for hospital '${hospital.name}' (ID: ${hospital._id})`
//             );

//             await createNotifications({
//                 userId: req.user?._id || null,
//                 dashboardType: ["AdminDashboard", "HospitalDashboard"],
//                 type: "info",
//                 title: "Hospital Documents Uploaded",
//                 message: `Documents for hospital '${hospital.name}' have been uploaded.`,
//                 link: `/hospitals/${hospital._id}/documents`,
//             });

//             res.status(200).json({ message: "Documents uploaded successfully. Proceed to next step." });

//         } catch (error) {
//             console.error("Error uploading hospital documents:", error);
//             if (error.message.includes("Only image and PDF files") || error.message.includes("File too large")) {
//                 return res.status(400).json({ message: error.message });
//             }
//             res.status(500).json({ message: "Failed to upload documents due to an internal server error. Please try again later." });
//         }
//     }
// );

// // --- ROUTE 3: Add Doctors (Step 3) ---
// router.post(
//     "/addDoctors",
//     // Dynamically generate fields for doctor images based on how many doctors might be sent
//     uploadDoctorImage.any(), // Use .any() to catch all incoming files and process them dynamically
//     async (req, res) => {
//         try {
//             const hospitalId = req.body.hospitalId; // Get hospital ID from the request body

//             if (!hospitalId) {
//                 return res.status(400).json({ message: "Hospital ID is required to add doctors." });
//             }

//             const hospital = await Hospital.findById(hospitalId);
//             if (!hospital) {
//                 return res.status(404).json({ message: "Hospital not found." });
//             }

//             const newDoctors = [];
//             // Frontend sends doctorData[index] as JSON strings.
//             // Loop through req.body to find all doctorData entries.
//             for (let i = 0; ; i++) {
//                 const doctorDataKey = `doctorData[${i}]`;
//                 if (!req.body[doctorDataKey]) {
//                     break; // No more doctor data entries
//                 }

//                 let doctor;
//                 try {
//                     doctor = JSON.parse(req.body[doctorDataKey]);
//                 } catch (e) {
//                     return res.status(400).json({ message: `Invalid JSON format for doctor data entry ${i}.` });
//                 }

//                 // Find the corresponding image for this doctor
//                 const doctorImageFile = req.files && req.files.find(file => file.fieldname === `doctorImage${i}`);

//                 // Validate doctor fields
//                 if (!doctor.name || !doctor.experience || !doctor.specialization) {
//                     return res.status(400).json({ message: `Missing required fields for doctor entry ${i + 1}.` });
//                 }
//                 if (!doctorImageFile) {
//                     return res.status(400).json({ message: `Image is required for doctor entry ${i + 1}.` });
//                 }

//                 newDoctors.push({
//                     name: doctor.name,
//                     experience: doctor.experience,
//                     specialization: doctor.specialization,
//                     image: doctorImageFile.path, // Store path to the uploaded image
//                     operationSuccessRate: doctor.operationSuccessRate || null,
//                 });
//             }

//             if (newDoctors.length === 0) {
//                 return res.status(400).json({ message: "No doctor data provided." });
//             }

//             // Append new doctors to the existing hospital's doctors array
//             hospital.doctors.push(...newDoctors);
//             hospital.status = 'pending_approval'; // Mark as pending approval after all steps
//             await hospital.save(); // Save the updated hospital document

//             await historyLogRecorder(
//                 req,
//                 hospital.constructor.modelName,
//                 "UPDATE",
//                 hospital._id,
//                 `Doctors added to hospital '${hospital.name}' (ID: ${hospital._id}) and submitted for approval.`
//             );

//             await createNotifications({
//                 userId: req.user?._id || null,
//                 dashboardType: ["AdminDashboard", "HospitalDashboard"],
//                 type: "success",
//                 title: "Hospital Registration Completed",
//                 message: `Hospital '${hospital.name}' has completed registration and is pending admin approval.`,
//                 link: `/hospitals/${hospital._id}`,
//             });

//             res.status(200).json({ message: "Doctors added successfully. Hospital registration completed and awaiting approval." });

//         } catch (error) {
//             console.error("Error adding doctors:", error);
//             if (error.message.includes("Only image files") || error.message.includes("File too large")) {
//                 return res.status(400).json({ message: error.message });
//             }
//             res.status(500).json({ message: "Failed to add doctors due to an internal server error. Please try again later." });
//         }
//     }
// );

router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;
        const hospitals = await Hospital.find({})
                                      .skip(skip)
                                      .limit(limit)
                                      .sort({ createdAt: -1 });
        const hasMore = hospitals.length === limit;

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
                `User fetched hospital details (page ${page}, limit ${limit}).`
            );
        } catch (logError) {
            console.error("Error logging action:", logError);
        }
        return res.status(200).json({
            hospitals: hospitals,
            hasMore: hasMore,
            currentPage: page,
            limit: limit
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

module.exports = router;