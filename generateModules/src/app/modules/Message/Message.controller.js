
import catchAsync from "../../utils/catchAsync.js";
import { 
  MessageServices
 } from "./Message.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Message
const createMessage = catchAsync(async (req, res) => {
  const result = await 
  MessageServices.createMessage(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Message created successfully",
    data: result,
  });
});

// Get all Message
const getAllMessage = catchAsync(async (req, res) => {
  const result = await 
  MessageServices.getAllMessage(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Message fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Message
const getSingleMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  MessageServices.getSingleMessage(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Message fetched successfully",
    data: result,
  });
});

// Update Message
const updateMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  MessageServices.updateMessage(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Message updated successfully",
    data: result,
  });
});

// Delete Message
const deleteMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  MessageServices.deleteMessage(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Message deleted successfully",
    data: result,
  });
});

export const MessageControllers ={
  createMessage,
  getAllMessage,
  getSingleMessage,
  updateMessage,
  deleteMessage

}
