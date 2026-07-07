
import catchAsync from "../../utils/catchAsync.js";
import { 
  StudentAcademicRecordServices
 } from "./StudentAcademicRecord.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create StudentAcademicRecord
const createStudentAcademicRecord = catchAsync(async (req, res) => {
  const result = await 
  StudentAcademicRecordServices.createStudentAcademicRecord(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "StudentAcademicRecord created successfully",
    data: result,
  });
});

// Get all StudentAcademicRecord
const getAllStudentAcademicRecord = catchAsync(async (req, res) => {
  const result = await 
  StudentAcademicRecordServices.getAllStudentAcademicRecord(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All StudentAcademicRecord fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single StudentAcademicRecord
const getSingleStudentAcademicRecord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StudentAcademicRecordServices.getSingleStudentAcademicRecord(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "StudentAcademicRecord fetched successfully",
    data: result,
  });
});

// Update StudentAcademicRecord
const updateStudentAcademicRecord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StudentAcademicRecordServices.updateStudentAcademicRecord(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "StudentAcademicRecord updated successfully",
    data: result,
  });
});

// Delete StudentAcademicRecord
const deleteStudentAcademicRecord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  StudentAcademicRecordServices.deleteStudentAcademicRecord(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "StudentAcademicRecord deleted successfully",
    data: result,
  });
});

export const StudentAcademicRecordControllers ={
  createStudentAcademicRecord,
  getAllStudentAcademicRecord,
  getSingleStudentAcademicRecord,
  updateStudentAcademicRecord,
  deleteStudentAcademicRecord

}
