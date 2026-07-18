
import express from "express";

import {
  ExamResultControllers,
} from "./ExamResult.controller.js";

const router = express.Router();

router.post("/", 
ExamResultControllers.createExamResult);
router.get("/", 
ExamResultControllers.getAllExamResult);

router.get(
  "/student/:studentId",
  ExamResultControllers.getStudentResultByStudentId
);

router.get("/:id", 
ExamResultControllers.getSingleExamResult);
router.patch("/:id", 
ExamResultControllers.updateExamResult);
router.delete("/:id", 
ExamResultControllers.deleteExamResult);

export const ExamResultRoutes = router;
