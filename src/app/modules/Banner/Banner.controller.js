
import catchAsync from "../../utils/catchAsync.js";
import { 
  BannerServices
 } from "./Banner.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Banner
const createBanner = catchAsync(async (req, res) => {
  const result = await 
  BannerServices.createBanner(req.file, req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Banner created successfully",
    data: result,
  });
});

// Get all Banner
const getAllBanner = catchAsync(async (req, res) => {
  const result = await 
  BannerServices.getAllBanner(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Banner fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Banner
const getSingleBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  BannerServices.getSingleBanner(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Banner fetched successfully",
    data: result,
  });
});

// Update Banner
const updateBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  BannerServices.updateBanner(id,req.file, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Banner updated successfully",
    data: result,
  });
});

// Delete Banner
const deleteBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  BannerServices.deleteBanner(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Banner deleted successfully",
    data: result,
  });
});

export const BannerControllers ={
  createBanner,
  getAllBanner,
  getSingleBanner,
  updateBanner,
  deleteBanner

}
