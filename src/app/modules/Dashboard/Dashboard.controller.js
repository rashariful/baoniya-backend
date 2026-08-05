// import { DashboardService } from "./Dashboard.service";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { DashboardService } from "./Dashboard.service.js";

// Dashboard Summary
const getDashboardSummary = catchAsync(async (req, res) => {
  const result = await DashboardService.getDashboardSummary();

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Dashboard summary fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardSummary,
};