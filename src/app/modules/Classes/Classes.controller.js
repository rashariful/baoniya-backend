
import catchAsync from "../../utils/catchAsync.js";
import { 
  ClassesServices
 } from "./Classes.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Classes
const createClasses = catchAsync(async (req, res) => {
  const result = await 
  ClassesServices.createClasses(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Classes created successfully",
    data: result,
  });
});

// Get all Classes
const getAllClasses = catchAsync(async (req, res) => {
  const result = await 
  ClassesServices.getAllClasses(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Classes fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Classes
const getSingleClasses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ClassesServices.getSingleClasses(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Classes fetched successfully",
    data: result,
  });
});

// Update Classes
const updateClasses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ClassesServices.updateClasses(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Classes updated successfully",
    data: result,
  });
});

// Delete Classes
const deleteClasses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ClassesServices.deleteClasses(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Classes deleted successfully",
    data: result,
  });
});

export const ClassesControllers ={
  createClasses,
  getAllClasses,
  getSingleClasses,
  updateClasses,
  deleteClasses

}
