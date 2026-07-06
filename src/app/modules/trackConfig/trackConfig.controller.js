
import catchAsync from "../../utils/catchAsync.js";
import { 
  TrackConfigServices
 } from "./trackConfig.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create trackConfig
const createTrackConfig = catchAsync(async (req, res) => {
  const result = await 
  TrackConfigServices.createTrackConfig(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "TrackConfig created successfully",
    data: result,
  });
});

// Get all trackConfig
const getAllTrackConfig = catchAsync(async (req, res) => {
  const result = await 
  TrackConfigServices.getAllTrackConfig(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All TrackConfig fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single trackConfig
const getSingleTrackConfig = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TrackConfigServices.getSingleTrackConfig(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "TrackConfig fetched successfully",
    data: result,
  });
});

// Update trackConfig
const updateTrackConfig = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TrackConfigServices.updateTrackConfig(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "TrackConfig updated successfully",
    data: result,
  });
});

// Delete trackConfig
const deleteTrackConfig = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TrackConfigServices.deleteTrackConfig(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "TrackConfig deleted successfully",
    data: result,
  });
});


// Get TrackingConfig By Store ID
const getTrackingConfigByStoreId = catchAsync(async (req, res) => {
 const storeId = req.storeId;

  const result =
    await TrackConfigServices.getTrackingConfigByStoreId(
      storeId
    );

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Track Config fetched by store id successfully",
    data: result,
  });
});


export const TrackConfigControllers ={
  createTrackConfig,
  getAllTrackConfig,
  getSingleTrackConfig,
  updateTrackConfig,
  deleteTrackConfig,
  getTrackingConfigByStoreId

}
