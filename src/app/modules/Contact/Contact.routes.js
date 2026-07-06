
import express from "express";

import {
  ContactControllers,
} from "./Contact.controller.js";

const router = express.Router();

router.post("/", 
ContactControllers.createContact);
router.get("/", 
ContactControllers.getAllContact);
router.get("/:id", 
ContactControllers.getSingleContact);
router.patch("/:id", 
ContactControllers.updateContact);
router.delete("/:id", 
ContactControllers.deleteContact);

export const ContactRoutes = router;
