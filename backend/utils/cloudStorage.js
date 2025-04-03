import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export const uploadToCloud = async (file, folder) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `eduverse/${folder}`,
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });

    // Delete file from local storage
    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Delete file from local storage if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFromCloud = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

// Get file URL from Cloudinary
export const getFileUrl = (publicId) => {
  return cloudinary.url(publicId);
};
