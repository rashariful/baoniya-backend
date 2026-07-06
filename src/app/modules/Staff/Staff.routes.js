
import express from "express";

import {
  StaffControllers,
} from "./Staff.controller.js";

const router = express.Router();

router.post("/", 
StaffControllers.createStaff);
router.get("/", 
StaffControllers.getAllStaff);
router.get("/:id", 
StaffControllers.getSingleStaff);
router.patch("/:id", 
StaffControllers.updateStaff);
router.delete("/:id", 
StaffControllers.deleteStaff);

export const StaffRoutes = router;
