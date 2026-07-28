
import catchAsync from "../../utils/catchAsync.js";
import { 
  SyncQueueServices
 } from "./SyncQueue.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create SyncQueue
const createSyncQueue = catchAsync(async (req, res) => {
  const result = await 
  SyncQueueServices.createSyncQueue(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "SyncQueue created successfully",
    data: result,
  });
});

// Get all SyncQueue
const getAllSyncQueue = catchAsync(async (req, res) => {
  const result = await 
  SyncQueueServices.getAllSyncQueue(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All SyncQueue fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single SyncQueue
const getSingleSyncQueue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SyncQueueServices.getSingleSyncQueue(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "SyncQueue fetched successfully",
    data: result,
  });
});

// Update SyncQueue
const updateSyncQueue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SyncQueueServices.updateSyncQueue(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "SyncQueue updated successfully",
    data: result,
  });
});

// Delete SyncQueue
const deleteSyncQueue = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SyncQueueServices.deleteSyncQueue(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "SyncQueue deleted successfully",
    data: result,
  });
});

export const SyncQueueControllers ={
  createSyncQueue,
  getAllSyncQueue,
  getSingleSyncQueue,
  updateSyncQueue,
  deleteSyncQueue

}
