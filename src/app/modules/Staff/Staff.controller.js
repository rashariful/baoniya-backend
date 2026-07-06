
import catchAsync from "../../utils/catchAsync.js";
import { 
  StaffServices
 } from "./Staff.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Staff
const createStaff = catchAsync(async (req, res) => {
  const result = await 
  StaffServices.createStaff(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Staff created successfully",
    data: result,
  });
});

// Get all Staff
const getAllStaff = catchAsync(async (req, res) => {
  const result = await 
  StaffServices.getAllStaff(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Staff fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Staff
const getSingleStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StaffServices.getSingleStaff(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Staff fetched successfully",
    data: result,
  });
});

// Update Staff
const updateStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StaffServices.updateStaff(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Staff updated successfully",
    data: result,
  });
});

// Delete Staff
const deleteStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StaffServices.deleteStaff(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Staff deleted successfully",
    data: result,
  });
});

export const StaffControllers ={
  createStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff

}
