import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import sharp from "sharp";
import config from "../config/index.js";

// Cloudinary config
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// Sanitize image name
const sanitizeImageName = (name) =>
  name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();

// Upload image to Cloudinary from buffer
export const sendImageToCloudinary = async (
  imageName,
  buffer,
  format = "webp",
  width,
  height
) => {
  const sanitizedImageName = sanitizeImageName(imageName);

  try {
    // Resize and convert to buffer using sharp
    const resizedBuffer = await sharp(buffer)
      .resize(width, height)
      .toFormat(format)
      .toBuffer();

    // Upload using stream and return promise
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: sanitizedImageName,
          resource_type: "image",
          // no format here
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(resizedBuffer);
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image.");
  }
};

// Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });
