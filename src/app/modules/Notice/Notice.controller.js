
import catchAsync from "../../utils/catchAsync.js";
import { 
  NoticeServices
 } from "./Notice.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Notice
const createNotice = catchAsync(async (req, res) => {
  const result = await 
  NoticeServices.createNotice(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Notice created successfully",
    data: result,
  });
});

// Get all Notice
const getAllNotice = catchAsync(async (req, res) => {
  const result = await 
  NoticeServices.getAllNotice(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Notice fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Notice
const getSingleNotice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  NoticeServices.getSingleNotice(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Notice fetched successfully",
    data: result,
  });
});

// Update Notice
const updateNotice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  NoticeServices.updateNotice(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Notice updated successfully",
    data: result,
  });
});

// Delete Notice
const deleteNotice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  NoticeServices.deleteNotice(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Notice deleted successfully",
    data: result,
  });
});

export const NoticeControllers ={
  createNotice,
  getAllNotice,
  getSingleNotice,
  updateNotice,
  deleteNotice

}
