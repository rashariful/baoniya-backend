
import express from "express";

import {
  AcademicSessionControllers,
} from "./AcademicSession.controller.js";

const router = express.Router();

router.post("/", 
AcademicSessionControllers.createAcademicSession);
router.get("/", 
AcademicSessionControllers.getAllAcademicSession);
router.get("/:id", 
AcademicSessionControllers.getSingleAcademicSession);
router.patch("/:id", 
AcademicSessionControllers.updateAcademicSession);
router.delete("/:id", 
AcademicSessionControllers.deleteAcademicSession);

export const AcademicSessionRoutes = router;
