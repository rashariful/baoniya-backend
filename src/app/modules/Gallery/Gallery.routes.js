import express from "express";
import { GalleryControllers } from "./Gallery.controller.js";
import { upload } from "../../utils/sendImageToCloudinary.js";

const router = express.Router();

// Create Gallery
router.post(
  "/",
  upload.single("thumbnail"),
  GalleryControllers.createGallery
);

// Get All Gallery
router.get(
  "/",
  GalleryControllers.getAllGallery
);

// Get Single Gallery
router.get(
  "/:id",
  GalleryControllers.getSingleGallery
);

// Update Gallery
router.patch(
  "/:id",
  upload.single("thumbnail"),
  GalleryControllers.updateGallery
);

// Delete Gallery
router.delete(
  "/:id",
  GalleryControllers.deleteGallery
);

export const GalleryRoutes = router;