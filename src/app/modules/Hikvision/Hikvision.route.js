import express from "express";
import multer from "multer";
import { AttendanceServices } from "../Attendance/Attendance.service";
// import { AttendanceServices } from "../attendance/attendance.service.js";

const router = express.Router();
const upload = multer();

const DEFAULT_DEVICE_ID = process.env.DEFAULT_HIKVISION_DEVICE_ID || "hik-device-1";

router.post("/hikvision/event-notify", upload.any(), async (req, res) => {
  try {
    let eventData = req.body;

    // Hikvision multipart e "event_log" field-e JSON pathay
    const eventPart = req.files?.find((f) => f.fieldname === "event_log");
    if (eventPart) {
      eventData = JSON.parse(eventPart.buffer.toString());
    }

    console.log("=== HIKVISION PUSH EVENT ===");
    console.log(JSON.stringify(eventData, null, 2));
    console.log("============================");

    const employeeNo = eventData?.AccessControllerEvent?.employeeNoString;
    const time = eventData?.dateTime;
    const major = eventData?.AccessControllerEvent?.majorEventType;
    const minor = eventData?.AccessControllerEvent?.subEventType;
    const verifyMode = eventData?.AccessControllerEvent?.currentVerifyMode;

    if (major === 5 && minor === 75 && employeeNo) {
      const mode = verifyMode?.toLowerCase() || "";
      let source = "device";
      if (mode.includes("fp")) source = "fingerprint";
      else if (mode.includes("face")) source = "face";
      else if (mode.includes("card")) source = "card";

      await AttendanceServices.markDeviceAttendance({
        deviceUserId: employeeNo,
        deviceId: DEFAULT_DEVICE_ID, // env theke, hardcode na
        source,
        timestamp: time,
      });

      console.log(`✅ Attendance marked for employeeNo=${employeeNo}, source=${source}`);
    } else {
      console.log("⚠️ Event ignored (not a successful verify event, or missing employeeNo)");
    }

    res.status(200).send("OK"); // device-ke acknowledge — must, noile retry loop hobe
  } catch (err) {
    console.error("Push event error:", err.message);
    res.status(200).send("OK"); // error hole-o 200 pathান
  }
});

export default router;