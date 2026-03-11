import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  // Accepts the local file path of the image to be uploaded
  try {
    if (!localFilePath) return null;

    // Upload the file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "flower_mart_products", // Organizes your images in Cloudinary
    });

    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return response;
  } catch (error) {
    console.error("CLOUDINARY ERROR:", error);
    fs.unlinkSync(localFilePath); // Remove the local file as upload failed
    return null;
  }
};

export { uploadOnCloudinary };

// Multer grabbed the file from your browser and put it in public/temp.

// Cloudinary Utility picked it up, uploaded it to their global servers, and gave you a permanent link.

// Controller saved that link + the flower details into your database.

// FS Unlink deleted the file from your computer to keep your server storage clean.
