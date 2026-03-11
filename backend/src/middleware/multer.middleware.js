import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Temporary storage for uploaded files before they are uploaded to Cloudinary
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the current timestamp and the original file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
