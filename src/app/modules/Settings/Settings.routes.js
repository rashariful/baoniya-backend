
import express from "express";

import {
  SettingsControllers,
} from "./Settings.controller.js";

const router = express.Router();

router.post("/", 
SettingsControllers.createSettings);
router.get("/", 
SettingsControllers.getAllSettings);
router.get("/:id", 
SettingsControllers.getSingleSettings);
router.patch("/:id", 
SettingsControllers.updateSettings);
router.delete("/:id", 
SettingsControllers.deleteSettings);

export const SettingsRoutes = router;
