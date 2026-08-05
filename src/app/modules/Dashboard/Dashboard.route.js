import express from "express";
import { DashboardController } from "./Dashboard.controller.js";
// import { DashboardController } from "./Dashboard.controller";

const router = express.Router();

router.get("/summary", DashboardController.getDashboardSummary);

export const DashboardRoutes = router;