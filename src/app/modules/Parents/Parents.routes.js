
import express from "express";

import {
  ParentsControllers,
} from "./Parents.controller.js";

const router = express.Router();

router.post("/", 
ParentsControllers.createParents);
router.get("/", 
ParentsControllers.getAllParents);
router.get("/:id", 
ParentsControllers.getSingleParents);
router.patch("/:id", 
ParentsControllers.updateParents);
router.delete("/:id", 
ParentsControllers.deleteParents);

export const ParentsRoutes = router;
