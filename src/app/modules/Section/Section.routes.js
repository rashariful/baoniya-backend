
import express from "express";

import {
  SectionControllers,
} from "./Section.controller.js";

const router = express.Router();

router.post("/", 
SectionControllers.createSection);
router.get("/", 
SectionControllers.getAllSection);
router.get("/:id", 
SectionControllers.getSingleSection);
router.patch("/:id", 
SectionControllers.updateSection);
router.delete("/:id", 
SectionControllers.deleteSection);

export const SectionRoutes = router;
