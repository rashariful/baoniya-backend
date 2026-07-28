
import express from "express";

import {
  DeviceControllers,
} from "./Device.controller.js";

const router = express.Router();

router.post("/", 
DeviceControllers.createDevice);
router.get("/", 
DeviceControllers.getAllDevice);
router.get("/:id", 
DeviceControllers.getSingleDevice);
router.patch("/:id", 
DeviceControllers.updateDevice);
router.delete("/:id", 
DeviceControllers.deleteDevice);

export const DeviceRoutes = router;
