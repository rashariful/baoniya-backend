
import catchAsync from "../../utils/catchAsync.js";
import { 
  ExaminationServices
 } from "./Examination.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Examination
const createExamination = catchAsync(async (req, res) => {
  const result = await 
  ExaminationServices.createExamination(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Examination created successfully",
    data: result,
  });
});

// Get all Examination
const getAllExamination = catchAsync(async (req, res) => {
  const result = await 
  ExaminationServices.getAllExamination(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Examination fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Examination
const getSingleExamination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExaminationServices.getSingleExamination(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Examination fetched successfully",
    data: result,
  });
});

// Update Examination
const updateExamination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExaminationServices.updateExamination(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Examination updated successfully",
    data: result,
  });
});

// Delete Examination
const deleteExamination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ExaminationServices.deleteExamination(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Examination deleted successfully",
    data: result,
  });
});

export const ExaminationControllers ={
  createExamination,
  getAllExamination,
  getSingleExamination,
  updateExamination,
  deleteExamination

}
