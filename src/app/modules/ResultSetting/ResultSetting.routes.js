
import express from "express";

import {
  ResultSettingControllers,
} from "./ResultSetting.controller.js";

const router = express.Router();

router.post("/", 
ResultSettingControllers.createResultSetting);
router.get("/", 
ResultSettingControllers.getAllResultSetting);
router.get("/:id", 
ResultSettingControllers.getSingleResultSetting);
router.patch("/:id", 
ResultSettingControllers.updateResultSetting);
router.delete("/:id", 
ResultSettingControllers.deleteResultSetting);

export const ResultSettingRoutes = router;
