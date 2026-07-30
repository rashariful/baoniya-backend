
import express from "express";

import {
  FinalResultControllers,
} from "./FinalResult.controller.js";

const router = express.Router();
router.post("/generate", FinalResultControllers.generateFinalResult);
router.post("/generate-bulk", FinalResultControllers.generateBulkFinalResult);
router.post("/", 
FinalResultControllers.createFinalResult);
router.get("/", 
FinalResultControllers.getAllFinalResult);
router.get("/:id", 
FinalResultControllers.getSingleFinalResult);
router.patch("/:id", 
FinalResultControllers.updateFinalResult);
router.delete("/:id", 
FinalResultControllers.deleteFinalResult);

export const FinalResultRoutes = router;
