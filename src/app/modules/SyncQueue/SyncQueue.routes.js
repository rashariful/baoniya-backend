
import express from "express";

import {
  SyncQueueControllers,
} from "./SyncQueue.controller.js";

const router = express.Router();

router.post("/", 
SyncQueueControllers.createSyncQueue);
router.get("/", 
SyncQueueControllers.getAllSyncQueue);
router.get("/:id", 
SyncQueueControllers.getSingleSyncQueue);
router.patch("/:id", 
SyncQueueControllers.updateSyncQueue);
router.delete("/:id", 
SyncQueueControllers.deleteSyncQueue);

export const SyncQueueRoutes = router;
