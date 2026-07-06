
import express from "express";

import {
  GradeRuleControllers,
} from "./GradeRule.controller.js";

const router = express.Router();

router.post("/", 
GradeRuleControllers.createGradeRule);
router.get("/", 
GradeRuleControllers.getAllGradeRule);
router.get("/:id", 
GradeRuleControllers.getSingleGradeRule);
router.patch("/:id", 
GradeRuleControllers.updateGradeRule);
router.delete("/:id", 
GradeRuleControllers.deleteGradeRule);

export const GradeRuleRoutes = router;
