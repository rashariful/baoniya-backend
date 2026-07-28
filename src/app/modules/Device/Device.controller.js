
import catchAsync from "../../utils/catchAsync.js";
import { 
  DeviceServices
 } from "./Device.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Device
const createDevice = catchAsync(async (req, res) => {
  const result = await 
  DeviceServices.createDevice(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Device created successfully",
    data: result,
  });
});

// Get all Device
const getAllDevice = catchAsync(async (req, res) => {
  const result = await 
  DeviceServices.getAllDevice(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Device fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Device
const getSingleDevice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  DeviceServices.getSingleDevice(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Device fetched successfully",
    data: result,
  });
});

// Update Device
const updateDevice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  DeviceServices.updateDevice(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Device updated successfully",
    data: result,
  });
});

// Delete Device
const deleteDevice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  DeviceServices.deleteDevice(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Device deleted successfully",
    data: result,
  });
});

export const DeviceControllers ={
  createDevice,
  getAllDevice,
  getSingleDevice,
  updateDevice,
  deleteDevice

}
