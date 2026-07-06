
import express from "express";

import {
  StudentControllers,
} from "./Student.controller.js";

const router = express.Router();

router.post("/", 
StudentControllers.createStudent);
router.get("/", 
StudentControllers.getAllStudent);
router.get("/:id", 
StudentControllers.getSingleStudent);
router.patch("/:id", 
StudentControllers.updateStudent);
router.delete("/:id", 
StudentControllers.deleteStudent);

export const StudentRoutes = router;
