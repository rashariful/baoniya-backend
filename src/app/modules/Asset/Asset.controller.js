
import catchAsync from "../../utils/catchAsync.js";
import { 
  AssetServices
 } from "./Asset.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Asset
const createAsset = catchAsync(async (req, res) => {
  const result = await 
  AssetServices.createAsset(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Asset created successfully",
    data: result,
  });
});

// Get all Asset
const getAllAsset = catchAsync(async (req, res) => {
  const result = await 
  AssetServices.getAllAsset(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Asset fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Asset
const getSingleAsset = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AssetServices.getSingleAsset(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Asset fetched successfully",
    data: result,
  });
});

// Update Asset
const updateAsset = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AssetServices.updateAsset(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Asset updated successfully",
    data: result,
  });
});

// Delete Asset
const deleteAsset = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  AssetServices.deleteAsset(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Asset deleted successfully",
    data: result,
  });
});

export const AssetControllers ={
  createAsset,
  getAllAsset,
  getSingleAsset,
  updateAsset,
  deleteAsset

}
