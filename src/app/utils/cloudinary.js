// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// console.log(CLOUDINARY_CLOUD_NAME)

/**
 * Upload file to cloudinary
 * @param {string} filePath - Local path of file (e.g., from multer)
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
async function uploadToCloudinary(filePath, folder = 'uploads') {
  return await cloudinary.uploader.upload(filePath, {
    folder
  });
}

/**
 * Delete file from cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<any>}
 */
async function deleteFromCloudinary(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}

export const CloudinaryService = {
  uploadToCloudinary,
  deleteFromCloudinary
};
