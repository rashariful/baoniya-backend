import { verifyRole, verifyToken } from "../../middlewares/authMiddleware.js";

import express from "express";

import {
  FeesControllers,
} from "./Fees.controller.js";

const router = express.Router();

router.post("/", 
FeesControllers.createFees);
router.get(
  "/my-fees",
  verifyToken,
  FeesControllers.getMyFees
);
router.get("/", 
FeesControllers.getAllFees);
router.get("/:id", 
FeesControllers.getSingleFees);
router.patch("/:id", 
FeesControllers.updateFees);
router.delete("/:id", 
FeesControllers.deleteFees);

export const FeesRoutes = router;
