
import express from "express";

import {
  NoticeControllers,
} from "./Notice.controller.js";
import { upload } from "../../utils/sendImageToCloudinary.js";

const router = express.Router();

router.post("/", upload.single("thumbnail"),
NoticeControllers.createNotice);
router.get("/", 
NoticeControllers.getAllNotice);
router.get("/:id", 
NoticeControllers.getSingleNotice);
router.patch("/:id", upload.single("thumbnail"),
NoticeControllers.updateNotice);
router.delete("/:id", 
NoticeControllers.deleteNotice);

export const NoticeRoutes = router;
