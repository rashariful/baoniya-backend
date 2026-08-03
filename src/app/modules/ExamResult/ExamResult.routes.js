import express from "express";
import { ExamResultControllers } from "./ExamResult.controller.js";

const router = express.Router();

// Specific / Custom Routes
router.post("/submit/student", ExamResultControllers.submitStudentAllSubjects);
router.post("/submit/subject-bulk", ExamResultControllers.submitSubjectAllStudents);
router.get("/student/:studentId", ExamResultControllers.getStudentResultByStudentId);
router.get("/highest-marks", ExamResultControllers.getHighestMarksPerSubject);   // ← নতুন

// Root Routes
router.route("/")
  .post(ExamResultControllers.createExamResult)
  .get(ExamResultControllers.getAllExamResult);
router.post("/calculate-positions", ExamResultControllers.calculatePositions);
// Dynamic ID Routes
router.route("/:id")
  .get(ExamResultControllers.getSingleExamResult)
  .patch(ExamResultControllers.updateExamResult)
  .delete(ExamResultControllers.deleteExamResult);

export const ExamResultRoutes = router;

// import express from "express";
// import { ExamResultControllers } from "./ExamResult.controller.js";

// const router = express.Router();

// // Specific / Custom Routes
// router.post("/submit/student", ExamResultControllers.submitStudentAllSubjects);
// router.post("/submit/subject-bulk", ExamResultControllers.submitSubjectAllStudents);
// router.get("/student/:studentId", ExamResultControllers.getStudentResultByStudentId);

// // Root Routes
// router.route("/")
//   .post(ExamResultControllers.createExamResult)
//   .get(ExamResultControllers.getAllExamResult);

// // Dynamic ID Routes
// router.route("/:id")
//   .get(ExamResultControllers.getSingleExamResult)
//   .patch(ExamResultControllers.updateExamResult)
//   .delete(ExamResultControllers.deleteExamResult);

// export const ExamResultRoutes = router;

