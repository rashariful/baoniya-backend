
import express from "express";

import {
  ClassGroupControllers,
} from "./ClassGroup.controller.js";

const router = express.Router();

router.post("/", 
ClassGroupControllers.createClassGroup);
router.get("/", 
ClassGroupControllers.getAllClassGroup);
router.get("/:id", 
ClassGroupControllers.getSingleClassGroup);
router.patch("/:id", 
ClassGroupControllers.updateClassGroup);
router.delete("/:id", 
ClassGroupControllers.deleteClassGroup);

export const ClassGroupRoutes = router;
