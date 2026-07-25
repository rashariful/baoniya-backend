
import express from "express";

import {
  AssetControllers,
} from "./Asset.controller.js";

const router = express.Router();

router.post("/", 
AssetControllers.createAsset);
router.get("/", 
AssetControllers.getAllAsset);
router.get("/:id", 
AssetControllers.getSingleAsset);
router.patch("/:id", 
AssetControllers.updateAsset);
router.delete("/:id", 
AssetControllers.deleteAsset);

export const AssetRoutes = router;
