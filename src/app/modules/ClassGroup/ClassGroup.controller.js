
import catchAsync from "../../utils/catchAsync.js";
import { 
  ClassGroupServices
 } from "./ClassGroup.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create ClassGroup
const createClassGroup = catchAsync(async (req, res) => {
  const result = await 
  ClassGroupServices.createClassGroup(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "ClassGroup created successfully",
    data: result,
  });
});

// Get all ClassGroup
const getAllClassGroup = catchAsync(async (req, res) => {
  const result = await 
  ClassGroupServices.getAllClassGroup(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All ClassGroup fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single ClassGroup
const getSingleClassGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ClassGroupServices.getSingleClassGroup(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ClassGroup fetched successfully",
    data: result,
  });
});

// Update ClassGroup
const updateClassGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ClassGroupServices.updateClassGroup(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ClassGroup updated successfully",
    data: result,
  });
});

// Delete ClassGroup
const deleteClassGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ClassGroupServices.deleteClassGroup(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ClassGroup deleted successfully",
    data: result,
  });
});

export const ClassGroupControllers ={
  createClassGroup,
  getAllClassGroup,
  getSingleClassGroup,
  updateClassGroup,
  deleteClassGroup

}
