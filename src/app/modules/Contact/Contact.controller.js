
import catchAsync from "../../utils/catchAsync.js";
import { 
  ContactServices
 } from "./Contact.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create Contact
const createContact = catchAsync(async (req, res) => {
  const result = await 
  ContactServices.createContact(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Contact created successfully",
    data: result,
  });
});

// Get all Contact
const getAllContact = catchAsync(async (req, res) => {
  const result = await 
  ContactServices.getAllContact(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Contact fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single Contact
const getSingleContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ContactServices.getSingleContact(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Contact fetched successfully",
    data: result,
  });
});

// Update Contact
const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ContactServices.updateContact(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Contact updated successfully",
    data: result,
  });
});

// Delete Contact
const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  ContactServices.deleteContact(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Contact deleted successfully",
    data: result,
  });
});

export const ContactControllers ={
  createContact,
  getAllContact,
  getSingleContact,
  updateContact,
  deleteContact

}
