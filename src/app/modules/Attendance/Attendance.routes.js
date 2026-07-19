import { Router } from "express";
import { AttendanceControllers } from "./Attendance.controller.js";
// import auth from "../../middlewares/auth.js"; // apnar existing auth middleware thakle uncomment koren

const router = Router(); 

// Admin/manual create
router.post("/", AttendanceControllers.createAttendance);
router.post("/sync-device", AttendanceControllers.syncDeviceAttendance);
// Mobile theke self check-in/out -> Phase 1 testing er jonno MAIN endpoint
// auth middleware thakle: router.post("/check-in", auth(), AttendanceControllers.selfCheckIn);
router.post("/check-in", AttendanceControllers.selfCheckIn);

// Fingerprint/Face device theke asha attendance -> Phase 2 (device lagle eta use hobe)
router.post("/device-checkin", AttendanceControllers.deviceCheckIn);
router.get("/all", AttendanceControllers.getAllAttendanceAll);
// Get all (with filters via query params)
router.get("/", AttendanceControllers.getAllAttendance);

// Get single
router.get("/:id", AttendanceControllers.getSingleAttendance);

// Update
router.patch("/:id", AttendanceControllers.updateAttendance);

// Delete
router.delete("/:id", AttendanceControllers.deleteAttendance);

export const AttendanceRoutes = router;

// import express from "express";

// import {
//   AttendanceControllers,
// } from "./Attendance.controller.js";

// const router = express.Router();

// router.post("/", 
// AttendanceControllers.createAttendance);
// router.get("/", 
// AttendanceControllers.getAllAttendance);
// router.get("/:id", 
// AttendanceControllers.getSingleAttendance);
// router.patch("/:id", 
// AttendanceControllers.updateAttendance);
// router.delete("/:id", 
// AttendanceControllers.deleteAttendance);

// export const AttendanceRoutes = router;
