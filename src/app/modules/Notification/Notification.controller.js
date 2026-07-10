import catchAsync from "../../utils/catchAsync.js";
import { NotificationServices } from "./Notification.service.js";
import sendResponse from "../../utils/sendResponse.js";

// ===== Existing CRUD (unchanged) =====
const createNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.createNotification(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Notification created successfully",
    data: result,
  });
});

const getAllNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.getAllNotification(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Notification fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getSingleNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NotificationServices.getSingleNotification(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Notification fetched successfully",
    data: result,
  });
});

const updateNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NotificationServices.updateNotification(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Notification updated successfully",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NotificationServices.deleteNotification(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});

// ===== NEW: Broadcast controllers =====
const broadcastToAll = catchAsync(async (req, res) => {
  const { message } = req.body;
  const sentBy = req.user?._id; // ✅ auth middleware theke ashbe
  const result = await NotificationServices.broadcastToAll(message, sentBy);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Broadcast sent to all students",
    data: result,
  });
});

const broadcastToSelected = catchAsync(async (req, res) => {
  const { studentIds, message } = req.body;
  const sentBy = req.user?._id;
  const result = await NotificationServices.broadcastToSelected(
    studentIds,
    message,
    sentBy
  );
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Broadcast sent to selected students",
    data: result,
  });
});

const broadcastToDueFees = catchAsync(async (req, res) => {
  const { message, month } = req.body;
  const sentBy = req.user?._id;
  const result = await NotificationServices.broadcastToDueFees(
    message,
    month,
    sentBy
  );
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Broadcast sent to due-fee students",
    data: result,
  });
});

export const NotificationControllers = {
  createNotification,
  getAllNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
  broadcastToAll,
  broadcastToSelected,
  broadcastToDueFees,
};