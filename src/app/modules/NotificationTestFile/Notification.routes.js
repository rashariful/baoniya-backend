import express from "express";
import { NotificationControllers } from "./Notification.controller.js";
// import auth from "../../middlewares/auth.js"; // ✅ tomar actual auth middleware path

const router = express.Router();

// ===== Existing CRUD =====
router.post("/", NotificationControllers.createNotification);
router.get("/", NotificationControllers.getAllNotification);
router.get("/:id", NotificationControllers.getSingleNotification);
router.patch("/:id", NotificationControllers.updateNotification);
router.delete("/:id", NotificationControllers.deleteNotification);

// ===== NEW: Broadcast routes =====
router.post(
  "/broadcast/all",
  NotificationControllers.broadcastToAll
);
router.post(
  "/broadcast/selected",
  NotificationControllers.broadcastToSelected
);
router.post(
  "/broadcast/due-fees",
  NotificationControllers.broadcastToDueFees
);

export const NotificationRoutes = router;