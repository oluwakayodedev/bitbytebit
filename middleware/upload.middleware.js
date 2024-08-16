const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure the directory is created!
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination Path:", path.join(__dirname, "../uploads"));
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // add timestamp to file name
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// upload
const upload = multer({ storage });

module.exports = upload;
