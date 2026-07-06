
import catchAsync from "../../utils/catchAsync.js";
import { 
  TeacherServices
 } from "./Teacher.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Teacher
const createTeacher = catchAsync(async (req, res) => {
  const result = await 
  TeacherServices.createTeacher(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Teacher created successfully",
    data: result,
  });
});

// Get all Teacher
const getAllTeacher = catchAsync(async (req, res) => {
  const result = await 
  TeacherServices.getAllTeacher(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Teacher fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Teacher
const getSingleTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TeacherServices.getSingleTeacher(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Teacher fetched successfully",
    data: result,
  });
});

// Update Teacher
const updateTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TeacherServices.updateTeacher(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Teacher updated successfully",
    data: result,
  });
});

// Delete Teacher
const deleteTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TeacherServices.deleteTeacher(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Teacher deleted successfully",
    data: result,
  });
});

export const TeacherControllers ={
  createTeacher,
  getAllTeacher,
  getSingleTeacher,
  updateTeacher,
  deleteTeacher

}
