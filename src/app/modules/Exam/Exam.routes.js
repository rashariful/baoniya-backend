
import express from "express";

import {
  ExamControllers,
} from "./Exam.controller.js";

const router = express.Router();

router.post("/", 
ExamControllers.createExam);
router.get("/", 
ExamControllers.getAllExam);
router.get("/:id", 
ExamControllers.getSingleExam);
router.patch("/:id", 
ExamControllers.updateExam);
router.delete("/:id", 
ExamControllers.deleteExam);

export const ExamRoutes = router;
