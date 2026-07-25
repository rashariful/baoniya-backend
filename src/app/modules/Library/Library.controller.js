
import catchAsync from "../../utils/catchAsync.js";
import { 
  LibraryServices
 } from "./Library.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Library
const createLibrary = catchAsync(async (req, res) => {
  const result = await 
  LibraryServices.createLibrary(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Library created successfully",
    data: result,
  });
});

// Get all Library
const getAllLibrary = catchAsync(async (req, res) => {
  const result = await 
  LibraryServices.getAllLibrary(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Library fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Library
const getSingleLibrary = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  LibraryServices.getSingleLibrary(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Library fetched successfully",
    data: result,
  });
});

// Update Library
const updateLibrary = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  LibraryServices.updateLibrary(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Library updated successfully",
    data: result,
  });
});

// Delete Library
const deleteLibrary = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  LibraryServices.deleteLibrary(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Library deleted successfully",
    data: result,
  });
});

export const LibraryControllers ={
  createLibrary,
  getAllLibrary,
  getSingleLibrary,
  updateLibrary,
  deleteLibrary

}
