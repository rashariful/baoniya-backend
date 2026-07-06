
import express from "express";

import {
  SubjectControllers,
} from "./Subject.controller.js";

const router = express.Router();

router.post("/", 
SubjectControllers.createSubject);
router.get("/", 
SubjectControllers.getAllSubject);
router.get("/:id", 
SubjectControllers.getSingleSubject);
router.patch("/:id", 
SubjectControllers.updateSubject);
router.delete("/:id", 
SubjectControllers.deleteSubject);

export const SubjectRoutes = router;
