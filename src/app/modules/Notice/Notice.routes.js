
import express from "express";

import {
  NoticeControllers,
} from "./Notice.controller.js";

const router = express.Router();

router.post("/", 
NoticeControllers.createNotice);
router.get("/", 
NoticeControllers.getAllNotice);
router.get("/:id", 
NoticeControllers.getSingleNotice);
router.patch("/:id", 
NoticeControllers.updateNotice);
router.delete("/:id", 
NoticeControllers.deleteNotice);

export const NoticeRoutes = router;
