
import catchAsync from "../../utils/catchAsync.js";
import { 
  ResultSettingServices
 } from "./ResultSetting.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create ResultSetting
const createResultSetting = catchAsync(async (req, res) => {
  const result = await 
  ResultSettingServices.createResultSetting(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "ResultSetting created successfully",
    data: result,
  });
});

// Get all ResultSetting
const getAllResultSetting = catchAsync(async (req, res) => {
  const result = await 
  ResultSettingServices.getAllResultSetting(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All ResultSetting fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single ResultSetting
const getSingleResultSetting = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ResultSettingServices.getSingleResultSetting(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ResultSetting fetched successfully",
    data: result,
  });
});

// Update ResultSetting
const updateResultSetting = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ResultSettingServices.updateResultSetting(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ResultSetting updated successfully",
    data: result,
  });
});

// Delete ResultSetting
const deleteResultSetting = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ResultSettingServices.deleteResultSetting(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "ResultSetting deleted successfully",
    data: result,
  });
});

export const ResultSettingControllers ={
  createResultSetting,
  getAllResultSetting,
  getSingleResultSetting,
  updateResultSetting,
  deleteResultSetting

}
