
import catchAsync from "../../utils/catchAsync.js";
import { 
  SectionServices
 } from "./Section.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Section
const createSection = catchAsync(async (req, res) => {
  const result = await 
  SectionServices.createSection(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Section created successfully",
    data: result,
  });
});

// Get all Section
const getAllSection = catchAsync(async (req, res) => {
  const result = await 
  SectionServices.getAllSection(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Section fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Section
const getSingleSection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SectionServices.getSingleSection(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Section fetched successfully",
    data: result,
  });
});

// Update Section
const updateSection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SectionServices.updateSection(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Section updated successfully",
    data: result,
  });
});

// Delete Section
const deleteSection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  SectionServices.deleteSection(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Section deleted successfully",
    data: result,
  });
});

export const SectionControllers ={
  createSection,
  getAllSection,
  getSingleSection,
  updateSection,
  deleteSection

}
