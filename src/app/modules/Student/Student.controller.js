
import catchAsync from "../../utils/catchAsync.js";
import { 
  StudentServices
 } from "./Student.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Student
const createStudent = catchAsync(async (req, res) => {
  const result = await 
  StudentServices.createStudent(    req.file,
req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

// Get all Student
const getAllStudent = catchAsync(async (req, res) => {
  const result = await 
  StudentServices.getAllStudent(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Student fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Student
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StudentServices.getSingleStudent(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Student fetched successfully",
    data: result,
  });
});

// Update Student
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StudentServices.updateStudent(id,req.file, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

// Delete Student
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StudentServices.deleteStudent(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

export const StudentControllers ={
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent

}
