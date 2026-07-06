import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { XlToJsonService } from "./xlToJson.service.js";

const xlToJson = catchAsync(async (req, res) => {
  const result = await XlToJsonService.xlToJson(req.file);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Data fetched successfully",
    data: result,
  });
});

export const XlToJsonController = {
  xlToJson,
};
