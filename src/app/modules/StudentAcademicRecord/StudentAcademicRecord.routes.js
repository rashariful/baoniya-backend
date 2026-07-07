
import express from "express";

import {
  StudentAcademicRecordControllers,
} from "./StudentAcademicRecord.controller.js";

const router = express.Router();

router.post("/", 
StudentAcademicRecordControllers.createStudentAcademicRecord);
router.get("/", 
StudentAcademicRecordControllers.getAllStudentAcademicRecord);
router.get("/:id", 
StudentAcademicRecordControllers.getSingleStudentAcademicRecord);
router.patch("/:id", 
StudentAcademicRecordControllers.updateStudentAcademicRecord);
router.delete("/:id", 
StudentAcademicRecordControllers.deleteStudentAcademicRecord);

export const StudentAcademicRecordRoutes = router;
