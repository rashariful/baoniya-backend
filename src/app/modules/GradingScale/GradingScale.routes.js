
import express from "express";

import {
  GradingScaleControllers,
} from "./GradingScale.controller.js";

const router = express.Router();

router.post("/", 
GradingScaleControllers.createGradingScale);
router.get("/", 
GradingScaleControllers.getAllGradingScale);
router.get("/:id", 
GradingScaleControllers.getSingleGradingScale);
router.patch("/:id", 
GradingScaleControllers.updateGradingScale);
router.delete("/:id", 
GradingScaleControllers.deleteGradingScale);

export const GradingScaleRoutes = router;
