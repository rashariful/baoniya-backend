
import express from "express";

import {
  ExaminationControllers,
} from "./Examination.controller.js";

const router = express.Router();

router.post("/", 
ExaminationControllers.createExamination);
router.get("/", 
ExaminationControllers.getAllExamination);
router.get("/:id", 
ExaminationControllers.getSingleExamination);
router.patch("/:id", 
ExaminationControllers.updateExamination);
router.delete("/:id", 
ExaminationControllers.deleteExamination);

export const ExaminationRoutes = router;
