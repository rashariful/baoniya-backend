
import catchAsync from "../../utils/catchAsync.js";
import { 
  SubjectServices
 } from "./Subject.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Subject
const createSubject = catchAsync(async (req, res) => {
  const result = await 
  SubjectServices.createSubject(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Subject created successfully",
    data: result,
  });
});

// Get all Subject
const getAllSubject = catchAsync(async (req, res) => {
  const result = await 
  SubjectServices.getAllSubject(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Subject fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Subject
const getSingleSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SubjectServices.getSingleSubject(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Subject fetched successfully",
    data: result,
  });
});

// Update Subject
const updateSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SubjectServices.updateSubject(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Subject updated successfully",
    data: result,
  });
});

// Delete Subject
const deleteSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SubjectServices.deleteSubject(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Subject deleted successfully",
    data: result,
  });
});

export const SubjectControllers ={
  createSubject,
  getAllSubject,
  getSingleSubject,
  updateSubject,
  deleteSubject

}
