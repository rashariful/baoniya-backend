
import catchAsync from "../../utils/catchAsync.js";
import { 
  DonateServices
 } from "./Donate.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Donate
const createDonate = catchAsync(async (req, res) => {
  const result = await 
  DonateServices.createDonate(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Donate created successfully",
    data: result,
  });
});

// Get all Donate
const getAllDonate = catchAsync(async (req, res) => {
  const result = await 
  DonateServices.getAllDonate(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Donate fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Donate
const getSingleDonate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  DonateServices.getSingleDonate(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Donate fetched successfully",
    data: result,
  });
});

// Update Donate
const updateDonate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  DonateServices.updateDonate(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Donate updated successfully",
    data: result,
  });
});

// Delete Donate
const deleteDonate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  DonateServices.deleteDonate(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Donate deleted successfully",
    data: result,
  });
});

export const DonateControllers ={
  createDonate,
  getAllDonate,
  getSingleDonate,
  updateDonate,
  deleteDonate

}
