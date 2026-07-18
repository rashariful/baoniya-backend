
import catchAsync from "../../utils/catchAsync.js";
import { 
  ExamResultServices
 } from "./ExamResult.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create ExamResult
const createExamResult = catchAsync(async (req, res) => {
  const result = await 
  ExamResultServices.createExamResult(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "ExamResult created successfully",
    data: result,
  });
});

// Get all ExamResult
const getAllExamResult = catchAsync(async (req, res) => {
  const result = await 
  ExamResultServices.getAllExamResult(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All ExamResult fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single ExamResult
const getSingleExamResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExamResultServices.getSingleExamResult(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ExamResult fetched successfully",
    data: result,
  });
});

// Update ExamResult
const updateExamResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExamResultServices.updateExamResult(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ExamResult updated successfully",
    data: result,
  });
});

// Delete ExamResult
const deleteExamResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExamResultServices.deleteExamResult(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ExamResult deleted successfully",
    data: result,
  });
});



const getStudentResultByStudentId = catchAsync(
  async (req, res) => {

    const { studentId } = req.params;


    const result =
      await ExamResultServices.getStudentResultByStudentId(
        studentId
      );


    sendResponse(res, {
      status: 200,
      success: true,
      message: "Student result fetched successfully",
      data: result
    });

  }
);
export const ExamResultControllers ={
  createExamResult,
  getAllExamResult,
  getSingleExamResult,
  updateExamResult,
  deleteExamResult,
  getStudentResultByStudentId

}
