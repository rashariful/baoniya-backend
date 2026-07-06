
import catchAsync from "../../utils/catchAsync.js";
import { 
  TrackEventServices
 } from "./trackEvent.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create trackEvent
const createTrackEvent = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    storeId: req.storeId || req.body.storeId,
  };

  // ✅ Request থেকে IP ও UserAgent নাও
  const requestMeta = {
    ip:        req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
    userAgent: req.headers["user-agent"],
  };

  const result = await TrackEventServices.createTrackEvent(payload, requestMeta);

  sendResponse(res, {
    status: 201,
    success: true,
    message: "TrackEvent created successfully",
    data: result,
  });
});

// const createTrackEvent = catchAsync(async (req, res) => {
//   const result = await 
//   TrackEventServices.createTrackEvent(req.body);
//   sendResponse(res, {
//     status: 201,
//     success: true,
//     message: "TrackEvent created successfully",
//     data: result,
//   });
// });

// Get all trackEvent
const getAllTrackEvent = catchAsync(async (req, res) => {
  const result = await 
  TrackEventServices.getAllTrackEvent(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All TrackEvent fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single trackEvent
const getSingleTrackEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TrackEventServices.getSingleTrackEvent(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "TrackEvent fetched successfully",
    data: result,
  });
});

// Update trackEvent
const updateTrackEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TrackEventServices.updateTrackEvent(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "TrackEvent updated successfully",
    data: result,
  });
});

// Delete trackEvent
const deleteTrackEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  TrackEventServices.deleteTrackEvent(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "TrackEvent deleted successfully",
    data: result,
  });
});

export const TrackEventControllers ={
  createTrackEvent,
  getAllTrackEvent,
  getSingleTrackEvent,
  updateTrackEvent,
  deleteTrackEvent

}
