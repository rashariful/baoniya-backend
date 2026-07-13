import { Gallery } from "./Gallery.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";

// Create Gallery
const createGallery = async (file, payload) => {
  try {
    if (file?.buffer) {
      const imageName = `gallery-${Date.now()}`;
      const { secure_url } = await sendImageToCloudinary(
        imageName,
        file.buffer
      );

      payload.thumbnail = secure_url; // অথবা payload.image যদি schema-তে image field থাকে
    }

    const result = await Gallery.create(payload);
    return result;
  } catch (error) {
    console.error("Failed to create gallery:", error);
    throw new Error("Failed to create gallery: " + error.message);
  }
};

// Get All Gallery
const getAllGallery = async (query) => {
  const GallerySearchableFields = [];

  const resultQuery = new QueryBuilder(Gallery.find(), query)
    .search(GallerySearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();

  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

// Get Single Gallery
const getSingleGallery = async (id) => {
  const result = await Gallery.findById(id);
  return result;
};

// Update Gallery
const updateGallery = async (id, file, payload) => {
  try {
    if (file?.buffer) {
      const imageName = `gallery-${Date.now()}`;
      const { secure_url } = await sendImageToCloudinary(
        imageName,
        file.buffer
      );

      payload.thumbnail = secure_url; // অথবা payload.image
    }

    const result = await Gallery.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new Error("Gallery not found");
    }

    return result;
  } catch (error) {
    console.error("Failed to update gallery:", error);
    throw new Error("Failed to update gallery: " + error.message);
  }
};

// Delete Gallery
const deleteGallery = async (id) => {
  const result = await Gallery.findByIdAndDelete(id);
  return result;
};

export const GalleryServices = {
  createGallery,
  getAllGallery,
  getSingleGallery,
  updateGallery,
  deleteGallery,
};