import { Router } from "express";
import multer from "multer";
import { AttendanceControllers } from "./Attendance.controller.js";
// import auth from "../../middlewares/auth.js"; // apnar existing auth middleware thakle uncomment koren

const router = Router();
const upload = multer();

// Admin/manual create
router.post("/", AttendanceControllers.createAttendance);

// Hikvision device sync endpoint (pull/cron)
router.post("/sync-device", AttendanceControllers.syncDeviceAttendance);

// Mobile theke self check-in/out
// router.post("/check-in", auth(), AttendanceControllers.selfCheckIn);
router.post("/check-in", AttendanceControllers.selfCheckIn);

// ✅ Fingerprint/Face device theke direct check-in (push) — multer.any() diye multipart parse
router.post("/device-checkin", upload.any(), AttendanceControllers.deviceCheckIn);

// Get all attendance with advanced filters (QueryBuilder)
router.get("/", AttendanceControllers.getAllAttendance);

// Get all with custom date format / specific filters
router.get("/all", AttendanceControllers.getAllAttendanceAll);

// Get single by ID
router.get("/:id", AttendanceControllers.getSingleAttendance);

// Update
router.patch("/:id", AttendanceControllers.updateAttendance);

// Delete
router.delete("/:id", AttendanceControllers.deleteAttendance);

export const AttendanceRoutes = router;