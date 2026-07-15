
import express from "express";

import {
  TeacherControllers,
} from "./Teacher.controller.js";
import { upload } from "../../utils/sendImageToCloudinary.js";

const router = express.Router();

router.post(
  "/",
  upload.single("thumbnail"),
  TeacherControllers.createTeacher
);

router.get("/", 
TeacherControllers.getAllTeacher);
router.get("/:id", 
TeacherControllers.getSingleTeacher);

router.patch(
  "/:id",
  upload.single("thumbnail"),
  TeacherControllers.updateTeacher
);
router.delete("/:id", 
TeacherControllers.deleteTeacher);

export const TeacherRoutes = router;
