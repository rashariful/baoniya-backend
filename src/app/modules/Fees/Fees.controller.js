
import catchAsync from "../../utils/catchAsync.js";
import { 
  FeesServices
 } from "./Fees.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Fees
const createFees = catchAsync(async (req, res) => {
  const result = await 
  FeesServices.createFees(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Fees created successfully",
    data: result,
  });
});

// Get all Fees
const getAllFees = catchAsync(async (req, res) => {
  const result = await 
  FeesServices.getAllFees(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Fees fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Fees
const getSingleFees = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  FeesServices.getSingleFees(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Fees fetched successfully",
    data: result,
  });
});

// Update Fees
const updateFees = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  FeesServices.updateFees(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Fees updated successfully",
    data: result,
  });
});

// Delete Fees
const deleteFees = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  FeesServices.deleteFees(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Fees deleted successfully",
    data: result,
  });
});

const getMyFees = catchAsync(async (req, res) => {
  const result = await FeesServices.getMyFees(req.user.id);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "My fees retrieved successfully",
    data: result,
  });
});

export const FeesControllers ={
  createFees,
  getAllFees,
  getSingleFees,
  updateFees,
  deleteFees,
  getMyFees

}
