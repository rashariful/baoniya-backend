
import catchAsync from "../../utils/catchAsync.js";
import { 
  FinalResultServices
 } from "./FinalResult.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create FinalResult
const createFinalResult = catchAsync(async (req, res) => {
  const result = await 
  FinalResultServices.createFinalResult(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "FinalResult created successfully",
    data: result,
  });
});

// Get all FinalResult
const getAllFinalResult = catchAsync(async (req, res) => {
  const result = await 
  FinalResultServices.getAllFinalResult(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All FinalResult fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single FinalResult
const getSingleFinalResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  FinalResultServices.getSingleFinalResult(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "FinalResult fetched successfully",
    data: result,
  });
});

// Update FinalResult
const updateFinalResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  FinalResultServices.updateFinalResult(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "FinalResult updated successfully",
    data: result,
  });
});

// Delete FinalResult
const deleteFinalResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  FinalResultServices.deleteFinalResult(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "FinalResult deleted successfully",
    data: result,
  });
});

const generateFinalResult = catchAsync(async (req, res) => {
  const result = await FinalResultServices.generateFinalResult(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "FinalResult generated successfully",
    data: result,
  });
});
export const FinalResultControllers ={
  createFinalResult,
  getAllFinalResult,
  getSingleFinalResult,
  updateFinalResult,
  deleteFinalResult,
  generateFinalResult

}
