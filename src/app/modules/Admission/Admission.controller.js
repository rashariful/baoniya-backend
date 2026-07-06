
import catchAsync from "../../utils/catchAsync.js";
import { 
  AdmissionServices
 } from "./Admission.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Admission
const createAdmission = catchAsync(async (req, res) => {
  const result = await 
  AdmissionServices.createAdmission(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Admission created successfully",
    data: result,
  });
});

// Get all Admission
const getAllAdmission = catchAsync(async (req, res) => {
  const result = await 
  AdmissionServices.getAllAdmission(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Admission fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Admission
const getSingleAdmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AdmissionServices.getSingleAdmission(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Admission fetched successfully",
    data: result,
  });
});

// Update Admission
const updateAdmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AdmissionServices.updateAdmission(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Admission updated successfully",
    data: result,
  });
});

// Delete Admission
const deleteAdmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AdmissionServices.deleteAdmission(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Admission deleted successfully",
    data: result,
  });
});

export const AdmissionControllers ={
  createAdmission,
  getAllAdmission,
  getSingleAdmission,
  updateAdmission,
  deleteAdmission

}
