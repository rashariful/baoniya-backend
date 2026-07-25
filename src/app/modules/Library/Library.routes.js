
import express from "express";

import {
  LibraryControllers,
} from "./Library.controller.js";

const router = express.Router();

router.post("/", 
LibraryControllers.createLibrary);
router.get("/", 
LibraryControllers.getAllLibrary);
router.get("/:id", 
LibraryControllers.getSingleLibrary);
router.patch("/:id", 
LibraryControllers.updateLibrary);
router.delete("/:id", 
LibraryControllers.deleteLibrary);

export const LibraryRoutes = router;
