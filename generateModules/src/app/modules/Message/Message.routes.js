
import express from "express";

import {
  MessageControllers,
} from "./Message.controller.js";

const router = express.Router();

router.post("/", 
MessageControllers.createMessage);
router.get("/", 
MessageControllers.getAllMessage);
router.get("/:id", 
MessageControllers.getSingleMessage);
router.patch("/:id", 
MessageControllers.updateMessage);
router.delete("/:id", 
MessageControllers.deleteMessage);

export const MessageRoutes = router;
