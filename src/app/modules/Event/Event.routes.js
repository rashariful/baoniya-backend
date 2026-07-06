
import express from "express";

import {
  EventControllers,
} from "./Event.controller.js";

const router = express.Router();

router.post("/", 
EventControllers.createEvent);
router.get("/", 
EventControllers.getAllEvent);
router.get("/:id", 
EventControllers.getSingleEvent);
router.patch("/:id", 
EventControllers.updateEvent);
router.delete("/:id", 
EventControllers.deleteEvent);

export const EventRoutes = router;
