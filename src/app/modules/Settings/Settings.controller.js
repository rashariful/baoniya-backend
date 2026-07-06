
import catchAsync from "../../utils/catchAsync.js";
import { 
  SettingsServices
 } from "./Settings.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Settings
const createSettings = catchAsync(async (req, res) => {
  const result = await 
  SettingsServices.createSettings(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Settings created successfully",
    data: result,
  });
});

// Get all Settings
const getAllSettings = catchAsync(async (req, res) => {
  const result = await 
  SettingsServices.getAllSettings(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Settings fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Settings
const getSingleSettings = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SettingsServices.getSingleSettings(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Settings fetched successfully",
    data: result,
  });
});

// Update Settings
const updateSettings = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SettingsServices.updateSettings(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Settings updated successfully",
    data: result,
  });
});

// Delete Settings
const deleteSettings = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SettingsServices.deleteSettings(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Settings deleted successfully",
    data: result,
  });
});

export const SettingsControllers ={
  createSettings,
  getAllSettings,
  getSingleSettings,
  updateSettings,
  deleteSettings

}
