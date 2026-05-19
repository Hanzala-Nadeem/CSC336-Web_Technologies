// Multer Configuration — File Upload Middleware
const multer = require("multer");
const path = require("path");

// Disk storage configuration
const storage = multer.diskStorage({
    destination: "./Public/uploads/products",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// File filter — only allow image files
function fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Error: Images only! (jpeg, jpg, png, gif, webp, avif)"));
    }
}

// Export configured multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: fileFilter
});

module.exports = upload;
