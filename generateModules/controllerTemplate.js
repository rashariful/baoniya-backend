const controllerTemplate = `
import catchAsync from "../../utils/catchAsync.js";
import { 
  {{uppercaseFileName}}Services
 } from "./{{lowercaseFileName}}.service.js";
import sendResponse from "../../utils/sendResponse.js";


// Create {{lowercaseFileName}}
const create{{uppercaseFileName}} = catchAsync(async (req, res) => {
  const result = await 
  {{uppercaseFileName}}Services.create{{uppercaseFileName}}(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "{{uppercaseFileName}} created successfully",
    data: result,
  });
});

// Get all {{lowercaseFileName}}
const getAll{{uppercaseFileName}} = catchAsync(async (req, res) => {
  const result = await 
  {{uppercaseFileName}}Services.getAll{{uppercaseFileName}}(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All {{uppercaseFileName}} fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single {{lowercaseFileName}}
const getSingle{{uppercaseFileName}} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  {{uppercaseFileName}}Services.getSingle{{uppercaseFileName}}(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "{{uppercaseFileName}} fetched successfully",
    data: result,
  });
});

// Update {{lowercaseFileName}}
const update{{uppercaseFileName}} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  {{uppercaseFileName}}Services.update{{uppercaseFileName}}(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "{{uppercaseFileName}} updated successfully",
    data: result,
  });
});

// Delete {{lowercaseFileName}}
const delete{{uppercaseFileName}} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await 
  {{uppercaseFileName}}Services.delete{{uppercaseFileName}}(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "{{uppercaseFileName}} deleted successfully",
    data: result,
  });
});

export const {{uppercaseFileName}}Controllers ={
  create{{uppercaseFileName}},
  getAll{{uppercaseFileName}},
  getSingle{{uppercaseFileName}},
  update{{uppercaseFileName}},
  delete{{uppercaseFileName}}

}
`;

export default controllerTemplate;
