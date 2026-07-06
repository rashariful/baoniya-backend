
import express from "express";

import {
  TrackConfigControllers,
} from "./trackConfig.controller.js";
import { storeResolver } from "../../middlewares/storeResolver.middleware.js";

const router = express.Router();

router.get(
  "/store",storeResolver,  
  TrackConfigControllers.getTrackingConfigByStoreId
);
router.post("/", 
TrackConfigControllers.createTrackConfig);
router.get("/", 
TrackConfigControllers.getAllTrackConfig);
router.get("/:id", 
TrackConfigControllers.getSingleTrackConfig);
router.patch("/:id", 
TrackConfigControllers.updateTrackConfig);
router.delete("/:id", 
TrackConfigControllers.deleteTrackConfig);

export const TrackConfigRoutes = router;
