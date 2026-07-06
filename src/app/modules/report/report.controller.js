import catchAsync from "../../utils/catchAsync.js";
import { ReportServices } from "./report.service.js";
import sendResponse from "../../utils/sendResponse.js";

// Create report
const createReport = catchAsync(async (req, res) => {
  const result = await ReportServices.createReport(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Report created successfully",
    data: result,
  });
});

// Get all report
const getAllReport = catchAsync(async (req, res) => {
  const result = await ReportServices.getAllReport(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All Report fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

// Get single report
const getSingleReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReportServices.getSingleReport(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Report fetched successfully",
    data: result,
  });
});

// Update report
const updateReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReportServices.updateReport(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Report updated successfully",
    data: result,
  });
});

// Delete report
const deleteReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReportServices.deleteReport(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Report deleted successfully",
    data: result,
  });
});

const fetchFinancialReport = async (req, res) => {
  try {
    const report = await ReportServices.getFinancialReport();
    res.status(200).json({
      success: true,
      message: "Financial report fetched successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial report",
      error: error.message,
    });
  }
};

const getSalesPurchaseSummaryController = async (req, res) => {
  try {
    const summary = await ReportServices.getSalesAndPurchaseSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ReportControllers = {
  createReport,
  getAllReport,
  getSingleReport,
  updateReport,
  deleteReport,
  fetchFinancialReport,
  getSalesPurchaseSummaryController,
};
