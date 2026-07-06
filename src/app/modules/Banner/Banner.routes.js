import express from "express";

import {
  BannerControllers,
} from "./Banner.controller.js";

import { upload } from "../../utils/sendImageToCloudinary.js";

import {
  getCache,
  clearCacheByPrefix,
} from "../../utils/cache/cache.js";

const router = express.Router();


// =========================
// CLEAR BANNER CACHE
// =========================
const clearBannerCache = async (req, res, next) => {
  await clearCacheByPrefix("banner:");
  next();
};


// =========================
// CREATE BANNER
// =========================
router.post(
  "/",
  upload.single("thumbnail"),
  clearBannerCache,
  BannerControllers.createBanner
);


// =========================
// GET ALL BANNERS (CACHED)
// =========================
router.get(
  "/",
  getCache(
    (req) =>
      `banner:list:${new URLSearchParams(req.query).toString()}`,
    600 // 10 min (banner frequent change হতে পারে)
  ),
  BannerControllers.getAllBanner
);


// =========================
// GET SINGLE BANNER (CACHED)
// =========================
router.get(
  "/:id",
  getCache(
    (req) => `banner:single:${req.params.id}`,
    600
  ),
  BannerControllers.getSingleBanner
);


// =========================
// UPDATE BANNER
// =========================
router.patch(
  "/:id",
  upload.single("thumbnail"),
  clearBannerCache,
  BannerControllers.updateBanner
);


// =========================
// DELETE BANNER
// =========================
router.delete(
  "/:id",
  clearBannerCache,
  BannerControllers.deleteBanner
);

export const BannerRoutes = router;