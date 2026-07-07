import express from "express";
import { AdmissionControllers } from "./Admission.controller.js";

const router = express.Router();

router.post("/", AdmissionControllers.createAdmission);

router.get("/", AdmissionControllers.getAllAdmission);

router.get("/:id", AdmissionControllers.getSingleAdmission);

router.patch("/:id", AdmissionControllers.updateAdmission);

// Business Actions
router.patch("/:id/approve", AdmissionControllers.approveAdmission);

router.patch("/:id/reject", AdmissionControllers.rejectAdmission);

router.delete("/:id", AdmissionControllers.deleteAdmission);

export const AdmissionRoutes = router;