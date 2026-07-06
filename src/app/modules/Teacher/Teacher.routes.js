
import express from "express";

import {
  TeacherControllers,
} from "./Teacher.controller.js";

const router = express.Router();

router.post("/", 
TeacherControllers.createTeacher);
router.get("/", 
TeacherControllers.getAllTeacher);
router.get("/:id", 
TeacherControllers.getSingleTeacher);
router.patch("/:id", 
TeacherControllers.updateTeacher);
router.delete("/:id", 
TeacherControllers.deleteTeacher);

export const TeacherRoutes = router;
