
import express from "express";

import {
  ClassesControllers,
} from "./Classes.controller.js";

const router = express.Router();

router.post("/", 
ClassesControllers.createClasses);
router.get("/", 
ClassesControllers.getAllClasses);
router.get("/:id", 
ClassesControllers.getSingleClasses);
router.patch("/:id", 
ClassesControllers.updateClasses);
router.delete("/:id", 
ClassesControllers.deleteClasses);

export const ClassesRoutes = router;
