
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'hospitalLicense' || file.fieldname === 'verificationDocument') {
            cb(null, '../Backend/uploads');
        } else {
            cb(null, '../Backend/uploads'); // For images (hospitalImage, hospitalGallery, glimpseInside)
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadHospitalData = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB overall limit per file
    fileFilter: function (req, file, cb) {
        // Allowed image file types
        const imageFiletypes = /jpeg|jpg|png|gif/;
        // Allowed document file types (including PDF)
        const documentFiletypes = /jpeg|jpg|png|pdf/;

        const mimetype = file.fieldname === 'hospitalLicense' || file.fieldname === 'verificationDocument'
            ? documentFiletypes.test(file.mimetype)
            : imageFiletypes.test(file.mimetype);

        const extname = file.fieldname === 'hospitalLicense' || file.fieldname === 'verificationDocument'
            ? documentFiletypes.test(path.extname(file.originalname).toLowerCase())
            : imageFiletypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${file.fieldname === 'hospitalLicense' || file.fieldname === 'verificationDocument' ? 'jpeg, jpg, png, pdf' : 'jpeg, jpg, png, gif'}`));
    }
});

module.exports = { uploadHospitalData }; // Export this single Multer instance