import express from "express";

import { ReportControllers } from "./report.controller.js";

const router = express.Router();

router.post("/", ReportControllers.createReport);
router.get("/", ReportControllers.getAllReport);
router.get("/sales-purchase-report", ReportControllers.getSalesPurchaseSummaryController);
router.get("/financial", ReportControllers.fetchFinancialReport);
router.get("/:id", ReportControllers.getSingleReport);
router.patch("/:id", ReportControllers.updateReport);
router.delete("/:id", ReportControllers.deleteReport);

export const ReportRoutes = router;
