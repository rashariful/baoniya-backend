
import catchAsync from "../../utils/catchAsync.js";
import { 
  ExamServices
 } from "./Exam.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Exam
const createExam = catchAsync(async (req, res) => {
  const result = await 
  ExamServices.createExam(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Exam created successfully",
    data: result,
  });
});

// Get all Exam
const getAllExam = catchAsync(async (req, res) => {
  const result = await 
  ExamServices.getAllExam(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Exam fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Exam
const getSingleExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExamServices.getSingleExam(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Exam fetched successfully",
    data: result,
  });
});

// Update Exam
const updateExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExamServices.updateExam(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Exam updated successfully",
    data: result,
  });
});

// Delete Exam
const deleteExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExamServices.deleteExam(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Exam deleted successfully",
    data: result,
  });
});

export const ExamControllers ={
  createExam,
  getAllExam,
  getSingleExam,
  updateExam,
  deleteExam

}
