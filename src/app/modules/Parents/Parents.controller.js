
import catchAsync from "../../utils/catchAsync.js";
import { 
  ParentsServices
 } from "./Parents.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Parents
const createParents = catchAsync(async (req, res) => {
  const result = await 
  ParentsServices.createParents(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Parents created successfully",
    data: result,
  });
});

// Get all Parents
const getAllParents = catchAsync(async (req, res) => {
  const result = await 
  ParentsServices.getAllParents(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Parents fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Parents
const getSingleParents = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ParentsServices.getSingleParents(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Parents fetched successfully",
    data: result,
  });
});

// Update Parents
const updateParents = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ParentsServices.updateParents(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Parents updated successfully",
    data: result,
  });
});

// Delete Parents
const deleteParents = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ParentsServices.deleteParents(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Parents deleted successfully",
    data: result,
  });
});

export const ParentsControllers ={
  createParents,
  getAllParents,
  getSingleParents,
  updateParents,
  deleteParents

}
