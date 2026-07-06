
import express from "express";

import {
  TrackEventControllers,
} from "./trackEvent.controller.js";

const router = express.Router();

router.post("/", 
TrackEventControllers.createTrackEvent);
router.get("/", 
TrackEventControllers.getAllTrackEvent);
router.get("/:id", 
TrackEventControllers.getSingleTrackEvent);
router.patch("/:id", 
TrackEventControllers.updateTrackEvent);
router.delete("/:id", 
TrackEventControllers.deleteTrackEvent);

export const TrackEventRoutes = router;
