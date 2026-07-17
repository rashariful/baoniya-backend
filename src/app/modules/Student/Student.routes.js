
import express from "express";

import {
  StudentControllers,
} from "./Student.controller.js";
import { upload } from "../../utils/sendImageToCloudinary.js";

const router = express.Router();

router.post("/", upload.single("thumbnail"),
StudentControllers.createStudent);
router.get("/", 
StudentControllers.getAllStudent);
router.get("/:id", 
StudentControllers.getSingleStudent);
router.patch("/:id", upload.single("thumbnail"),
StudentControllers.updateStudent);
router.delete("/:id", 
StudentControllers.deleteStudent);

export const StudentRoutes = router;
