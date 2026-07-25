
import catchAsync from "../../utils/catchAsync.js";
import { 
  GradingScaleServices
 } from "./GradingScale.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create GradingScale
const createGradingScale = catchAsync(async (req, res) => {
  const result = await 
  GradingScaleServices.createGradingScale(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "GradingScale created successfully",
    data: result,
  });
});

// Get all GradingScale
const getAllGradingScale = catchAsync(async (req, res) => {
  const result = await 
  GradingScaleServices.getAllGradingScale(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All GradingScale fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single GradingScale
const getSingleGradingScale = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  GradingScaleServices.getSingleGradingScale(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "GradingScale fetched successfully",
    data: result,
  });
});

// Update GradingScale
const updateGradingScale = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  GradingScaleServices.updateGradingScale(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "GradingScale updated successfully",
    data: result,
  });
});

// Delete GradingScale
const deleteGradingScale = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  GradingScaleServices.deleteGradingScale(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "GradingScale deleted successfully",
    data: result,
  });
});

export const GradingScaleControllers ={
  createGradingScale,
  getAllGradingScale,
  getSingleGradingScale,
  updateGradingScale,
  deleteGradingScale

}
