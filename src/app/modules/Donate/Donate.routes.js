
import express from "express";

import {
  DonateControllers,
} from "./Donate.controller.js";

const router = express.Router();

router.post("/", 
DonateControllers.createDonate);
router.get("/", 
DonateControllers.getAllDonate);
router.get("/:id", 
DonateControllers.getSingleDonate);
router.patch("/:id", 
DonateControllers.updateDonate);
router.delete("/:id", 
DonateControllers.deleteDonate);

export const DonateRoutes = router;
