// utils/uploadFile.js
const cloudinary = require("../lib/cloudinary");
const dotenv = require("dotenv");
dotenv.config();

const uploadToCloudServiceProfilePicture = async (filePath) => {
  try {
    // Upload ke Claudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUD_FOLDER, // opsional: nama folder di Cloudinary
    });

    const optimizeUrl = cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
      crop: "fill",
      gravity: "auto",
    });
    return optimizeUrl; // URL file
  } catch (error) {
    throw new Error("Gagal upload ke Cloudinary: " + error.message);
  }
};

module.exports = uploadToCloudServiceProfilePicture;
