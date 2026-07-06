
import catchAsync from "../../utils/catchAsync.js";
import { 
  GradeRuleServices
 } from "./GradeRule.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create GradeRule
const createGradeRule = catchAsync(async (req, res) => {
  const result = await 
  GradeRuleServices.createGradeRule(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "GradeRule created successfully",
    data: result,
  });
});

// Get all GradeRule
const getAllGradeRule = catchAsync(async (req, res) => {
  const result = await 
  GradeRuleServices.getAllGradeRule(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All GradeRule fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single GradeRule
const getSingleGradeRule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  GradeRuleServices.getSingleGradeRule(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "GradeRule fetched successfully",
    data: result,
  });
});

// Update GradeRule
const updateGradeRule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  GradeRuleServices.updateGradeRule(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "GradeRule updated successfully",
    data: result,
  });
});

// Delete GradeRule
const deleteGradeRule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  GradeRuleServices.deleteGradeRule(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "GradeRule deleted successfully",
    data: result,
  });
});

export const GradeRuleControllers ={
  createGradeRule,
  getAllGradeRule,
  getSingleGradeRule,
  updateGradeRule,
  deleteGradeRule

}
