
import catchAsync from "../../utils/catchAsync.js";
import { 
  CustomerServices
 } from "./customer.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create customer
const createCustomer = catchAsync(async (req, res) => {
  const result = await 
  CustomerServices.createCustomer(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Customer created successfully",
    data: result,
  });
});

// Get all customer
const getAllCustomer = catchAsync(async (req, res) => {
  const result = await 
  CustomerServices.getAllCustomer(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Customer fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single customer
const getSingleCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  CustomerServices.getSingleCustomer(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Customer fetched successfully",
    data: result,
  });
});

// Update customer
const updateCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  CustomerServices.updateCustomer(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Customer updated successfully",
    data: result,
  });
});

// Delete customer
const deleteCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  CustomerServices.deleteCustomer(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Customer deleted successfully",
    data: result,
  });
});

export const CustomerControllers ={
  createCustomer,
  getAllCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer

}
