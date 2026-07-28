import express from "express";
import { ExamResultControllers } from "./ExamResult.controller.js";

const router = express.Router();

// Specific / Custom Routes
router.post("/submit/student", ExamResultControllers.submitStudentAllSubjects);
router.post("/submit/subject-bulk", ExamResultControllers.submitSubjectAllStudents);
router.get("/student/:studentId", ExamResultControllers.getStudentResultByStudentId);

// Root Routes
router.route("/")
  .post(ExamResultControllers.createExamResult)
  .get(ExamResultControllers.getAllExamResult);

// Dynamic ID Routes
router.route("/:id")
  .get(ExamResultControllers.getSingleExamResult)
  .patch(ExamResultControllers.updateExamResult)
  .delete(ExamResultControllers.deleteExamResult);

export const ExamResultRoutes = router;


// import express from "express";

// import {
//   ExamResultControllers,
// } from "./ExamResult.controller.js";

// const router = express.Router();

// router.post("/submit/student", ExamResultControllers.submitStudentAllSubjects);
// router.post("/submit/subject-bulk", ExamResultControllers.submitSubjectAllStudents);

// router.post("/", 
// ExamResultControllers.createExamResult);
// router.get("/", 
// ExamResultControllers.getAllExamResult);

// router.get(
//   "/student/:studentId",
//   ExamResultControllers.getStudentResultByStudentId
// );

// router.get("/:id", 
// ExamResultControllers.getSingleExamResult);
// router.patch("/:id", 
// ExamResultControllers.updateExamResult);
// router.delete("/:id", 
// ExamResultControllers.deleteExamResult);

// export const ExamResultRoutes = router;
