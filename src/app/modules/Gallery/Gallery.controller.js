import catchAsync from "../../utils/catchAsync.js";
import { GalleryServices } from "./Gallery.service.js";
import sendResponse from "../../utils/sendResponse.js";

// Create Gallery
const createGallery = catchAsync(async (req, res) => {
  const result = await GalleryServices.createGallery(req.file, req.body);

  sendResponse(res, {
    status: 201,
    success: true,
    message: "Gallery created successfully",
    data: result,
  });
});

// Get All Gallery
const getAllGallery = catchAsync(async (req, res) => {
  const result = await GalleryServices.getAllGallery(req.query);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Gallery fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get Single Gallery
const getSingleGallery = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GalleryServices.getSingleGallery(id);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Gallery fetched successfully",
    data: result,
  });
});

// Update Gallery
const updateGallery = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GalleryServices.updateGallery(
    id,
    req.file,
    req.body
  );

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Gallery updated successfully",
    data: result,
  });
});

// Delete Gallery
const deleteGallery = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GalleryServices.deleteGallery(id);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Gallery deleted successfully",
    data: result,
  });
});

export const GalleryControllers = {
  createGallery,
  getAllGallery,
  getSingleGallery,
  updateGallery,
  deleteGallery,
};