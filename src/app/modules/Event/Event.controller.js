
import catchAsync from "../../utils/catchAsync.js";
import { 
  EventServices
 } from "./Event.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Event
const createEvent = catchAsync(async (req, res) => {
  const result = await 
  EventServices.createEvent(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

// Get all Event
const getAllEvent = catchAsync(async (req, res) => {
  const result = await 
  EventServices.getAllEvent(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Event fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Event
const getSingleEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  EventServices.getSingleEvent(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Event fetched successfully",
    data: result,
  });
});

// Update Event
const updateEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  EventServices.updateEvent(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

// Delete Event
const deleteEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  EventServices.deleteEvent(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Event deleted successfully",
    data: result,
  });
});

export const EventControllers ={
  createEvent,
  getAllEvent,
  getSingleEvent,
  updateEvent,
  deleteEvent

}
