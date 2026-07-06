
import catchAsync from "../../utils/catchAsync.js";
import { 
  AcademicSessionServices
 } from "./AcademicSession.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create AcademicSession
const createAcademicSession = catchAsync(async (req, res) => {
  const result = await 
  AcademicSessionServices.createAcademicSession(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "AcademicSession created successfully",
    data: result,
  });
});

// Get all AcademicSession
const getAllAcademicSession = catchAsync(async (req, res) => {
  const result = await 
  AcademicSessionServices.getAllAcademicSession(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All AcademicSession fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single AcademicSession
const getSingleAcademicSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AcademicSessionServices.getSingleAcademicSession(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "AcademicSession fetched successfully",
    data: result,
  });
});

// Update AcademicSession
const updateAcademicSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AcademicSessionServices.updateAcademicSession(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "AcademicSession updated successfully",
    data: result,
  });
});

// Delete AcademicSession
const deleteAcademicSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AcademicSessionServices.deleteAcademicSession(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "AcademicSession deleted successfully",
    data: result,
  });
});

export const AcademicSessionControllers ={
  createAcademicSession,
  getAllAcademicSession,
  getSingleAcademicSession,
  updateAcademicSession,
  deleteAcademicSession

}
