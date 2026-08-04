import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AttendanceServices } from "./Attendance.service.js";

const DEFAULT_DEVICE_ID = process.env.DEFAULT_HIKVISION_DEVICE_ID || "hik-device-1";

// 1. Manual create (admin app theke)
const createAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.createAttendance(req.body);
  sendResponse(res, {
    status: 201,
    success: true,
    message: "Attendance created successfully",
    data: result,
  });
});

// 2. Mobile theke self check-in/out
const selfCheckIn = catchAsync(async (req, res) => {
  const userId = req.user?._id || req.body.userId;

  const result = await AttendanceServices.markSelfAttendance(userId, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance marked successfully",
    data: result,
  });
});

// 3. Device theke check-in (Hikvision PUSH — multipart/form-data format)

const deviceCheckIn = catchAsync(async (req, res) => {
  let eventData = req.body;

  // Multipart form-data support
  const eventPart = req.files?.find((f) => f.fieldname === "event_log");

  if (eventPart) {
    try {
      eventData = JSON.parse(eventPart.buffer.toString());
    } catch (e) {
      console.error("event_log JSON parse error:", e.message);
      return res.status(400).send("Invalid event_log JSON");
    }
  }

  // AccessControllerEvent যদি string হয়
  if (typeof eventData?.AccessControllerEvent === "string") {
    try {
      eventData.AccessControllerEvent = JSON.parse(
        eventData.AccessControllerEvent
      );
    } catch (e) {
      console.error("AccessControllerEvent parse error:", e.message);
      return res.status(400).send("Invalid AccessControllerEvent JSON");
    }
  }

  const rootEvent = eventData?.AccessControllerEvent || {};
  const hikEvent = rootEvent?.AccessControllerEvent || {};

  const employeeNo = hikEvent.employeeNoString || hikEvent.employeeNo || null;

  const major = Number(hikEvent.majorEventType);
  const minor = Number(hikEvent.subEventType);

  const verifyMode = hikEvent.currentVerifyMode || "";

  const timestamp =
    rootEvent.dateTime || eventData.dateTime || new Date().toISOString();

  // Hikvision Attendance Event
  // minor 6, 75, 38, 21, 22 সবগুলো accept
  const VALID_MINORS = [6, 75, 38, 21, 22];

  if (major === 5 && employeeNo && VALID_MINORS.includes(minor)) {
    // ============================================
    // verifyMode / FaceRect / minor থেকে method বের করা
    // ============================================
    let method = "unknown";

    const faceRect = hikEvent.FaceRect;
    const mode = verifyMode.toLowerCase();

    if (faceRect) {
      method = "face";
    } else if (mode.includes("finger") || mode.includes("fp")) {
      method = "fingerprint";
    } else if (mode.includes("face")) {
      method = "face";
    } else if (mode.includes("card")) {
      method = "card";
    } else if (minor === 38) {
      // এই firmware-এ subEventType 38 => fingerprint
      method = "fingerprint";
    } else if (minor === 75) {
      // subEventType 75 => face
      method = "face";
    }

    try {
      await AttendanceServices.markDeviceAttendance({
        deviceUserId: String(employeeNo),
        deviceId: DEFAULT_DEVICE_ID,
        source: "device",
        method,
        timestamp,
      });
    } catch (err) {
      console.error(`Attendance mark failed for ${employeeNo}:`, err.message);
    }
  } else {
    // console.log(`Ignored Event -> Major:${major} Minor:${minor} Employee:${employeeNo}`);
  }

  return res.status(200).send("OK");
});



// 4. Sob attendance (QueryBuilder diye filter, pagination, sort)
const getAllAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.getAllAttendance(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance retrieved successfully",
    data: result,
  });
});

// 5. Single attendance by ID
const getSingleAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.getSingleAttendance(req.params.id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance retrieved successfully",
    data: result,
  });
});

// 6. Update attendance
const updateAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.updateAttendance(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance updated successfully",
    data: result,
  });
});

// 7. Delete attendance
const deleteAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.deleteAttendance(req.params.id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance deleted successfully",
    data: result,
  });
});

// 8. Hikvision Sync Endpoint (Cron ba manual trigger — PULL/backup)
const syncDeviceAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.syncDeviceAttendance();
  res.status(200).json({
    success: true,
    message: `${result.length} attendance records synced`,
    data: result,
  });
});

// 9. Legacy / Custom getAllAll
const getAllAttendanceAll = catchAsync(async (req, res) => {
  const filters = {
    userId: req.query.userId,
    status: req.query.status,
    source: req.query.source,
    date: req.query.date,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  const result = await AttendanceServices.getAllAttendance(filters);

  res.status(200).json({
    success: true,
    message: "Attendance fetched successfully",
    data: result,
  });
});

export const AttendanceControllers = {
  createAttendance,
  selfCheckIn,
  deviceCheckIn,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  syncDeviceAttendance,
  getAllAttendanceAll,
};

// import catchAsync from "../../utils/catchAsync.js";
// import sendResponse from "../../utils/sendResponse.js";
// import { AttendanceServices } from "./Attendance.service.js";

// // 1. Manual create (admin app theke)
// const createAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.createAttendance(req.body);
//   sendResponse(res, {
//     status: 201,
//     success: true,
//     message: "Attendance created successfully",
//     data: result,
//   });
// });

// // 2. Mobile theke self check-in/out
// const selfCheckIn = catchAsync(async (req, res) => {
//   const userId = req.user?._id || req.body.userId;

//   const result = await AttendanceServices.markSelfAttendance(userId, req.body);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance marked successfully",
//     data: result,
//   });
// });

// // 3. Device theke check-in (push)
// const deviceCheckIn = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.markDeviceAttendance(req.body);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Device attendance recorded successfully",
//     data: result,
//   });
// });

// // 4. Sob attendance (QueryBuilder diye filter, pagination, sort)
// const getAllAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.getAllAttendance(req.query);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance retrieved successfully",
//     data: result,
//   });
// });

// // 5. Single attendance by ID
// const getSingleAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.getSingleAttendance(req.params.id);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance retrieved successfully",
//     data: result,
//   });
// });

// // 6. Update attendance
// const updateAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.updateAttendance(
//     req.params.id,
//     req.body
//   );
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance updated successfully",
//     data: result,
//   });
// });

// // 7. Delete attendance
// const deleteAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.deleteAttendance(req.params.id);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance deleted successfully",
//     data: result,
//   });
// });

// // 8. Hikvision Sync Endpoint (Cron ba manual trigger)
// const syncDeviceAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.syncDeviceAttendance();
//   res.status(200).json({
//     success: true,
//     message: `${result.length} attendance records synced`,
//     data: result,
//   });
// });

// // 9. Legacy / Custom getAllAll (jodi service-e thake ba query map korte hoy)
// const getAllAttendanceAll = catchAsync(async (req, res) => {
//   const filters = {
//     userId: req.query.userId,
//     status: req.query.status,
//     source: req.query.source,
//     date: req.query.date,           // single date: "2026-07-18"
//     startDate: req.query.startDate, // range: "2026-07-01"
//     endDate: req.query.endDate,     // range: "2026-07-18"
//   };

//   // Ekhane QueryBuilder wala getAllAttendance use kora best, or service-e method thakle call hobe
//   const result = await AttendanceServices.getAllAttendance(filters);

//   res.status(200).json({
//     success: true,
//     message: "Attendance fetched successfully",
//     data: result,
//   });
// });


// export const AttendanceControllers = {
//   createAttendance,
//   selfCheckIn,
//   deviceCheckIn,
//   getAllAttendance,
//   getSingleAttendance,
//   updateAttendance,
//   deleteAttendance,
//   syncDeviceAttendance,
//   getAllAttendanceAll,
// };


// // import { AttendanceServices } from "./attendance.service.js";
// import catchAsync from "../../utils/catchAsync.js"; // apnar existing path diye adjust korben
// import sendResponse from "../../utils/sendResponse.js"; // apnar existing path diye adjust korben
// import { AttendanceServices } from "./Attendance.service.js";

// // 1. Manual create (admin app theke)
// const createAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.createAttendance(req.body);
//   sendResponse(res, {
//     status: 201,
//     success: true,
//     message: "Attendance created successfully",
//     data: result,
//   });
// });

// // 2. Mobile theke self check-in/out (Phase 1 testing - fingerprint na thakleo eta diye test kora jabe)
// const selfCheckIn = catchAsync(async (req, res) => {
//   // req.user._id - apnar auth middleware theke logged-in user er id asbe
//   // testing er somoy jodi auth setup na thake, req.body.userId diyeo pass kora jete pare
//   const userId = req.user?._id || req.body.userId;

//   const result = await AttendanceServices.markSelfAttendance(userId, req.body);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance marked successfully",
//     data: result,
//   });
// });

// // 3. Device theke check-in (fingerprint/face device ei endpoint e hit korbe)
// const deviceCheckIn = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.markDeviceAttendance(req.body);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Device attendance recorded successfully",
//     data: result,
//   });
// });

// // 4. Sob attendance (query filters: userId, status, source, startDate, endDate)
// const getAllAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.getAllAttendance(req.query);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance retrieved successfully",
//     data: result,
//   });
// });

// // 5. Single attendance
// const getSingleAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.getSingleAttendance(req.params.id);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance retrieved successfully",
//     data: result,
//   });
// });

// // 6. Update
// const updateAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.updateAttendance(
//     req.params.id,
//     req.body
//   );
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance updated successfully",
//     data: result,
//   });
// });

// // 7. Delete
// const deleteAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.deleteAttendance(req.params.id);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance deleted successfully",
//     data: result,
//   });
// });

// const syncDeviceAttendance = catchAsync(async (req, res) => {
//   const result = await AttendanceServices.syncDeviceAttendance();
//   res.status(200).json({
//     success: true,
//     message: `${result.length} attendance records synced`,
//     data: result,
//   });
// });


// // attendance.controller.js
// const getAllAttendanceAll = catchAsync(async (req, res) => {
//   const filters = {
//     userId: req.query.userId,
//     status: req.query.status,
//     source: req.query.source,
//     date: req.query.date,           // single date: "2026-07-18"
//     startDate: req.query.startDate, // range: "2026-07-01"
//     endDate: req.query.endDate,     // range: "2026-07-18"
//   };

//   const result = await AttendanceServices.getAllAttendanceAll(filters);

//   res.status(200).json({
//     success: true,
//     message: "Attendance fetched successfully",
//     data: result,
//   });
// });


// export const AttendanceControllers = {
//   createAttendance,
//   selfCheckIn,
//   deviceCheckIn,
//   getAllAttendance,
//   getSingleAttendance,
//   updateAttendance,
//   deleteAttendance,
//   syncDeviceAttendance,
//   getAllAttendanceAll
// };


// import catchAsync from "../../utils/catchAsync.js";
// import { 
//   AttendanceServices
//  } from "./Attendance.service.js";
// import sendResponse from "../../utils/sendResponse.js";


// // Create Attendance
// const createAttendance = catchAsync(async (req, res) => {
//   const result = await 
//   AttendanceServices.createAttendance(req.body);
//   sendResponse(res, {
//     status: 201,
//     success: true,
//     message: "Attendance created successfully",
//     data: result,
//   });
// });

// // Get all Attendance
// const getAllAttendance = catchAsync(async (req, res) => {
//   const result = await 
//   AttendanceServices.getAllAttendance(req.query);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "All Attendance fetched successfully",
//     meta: result?.meta,
//     data: result?.data,
//   });
// });

// // Get single Attendance
// const getSingleAttendance = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await 
//   AttendanceServices.getSingleAttendance(id);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance fetched successfully",
//     data: result,
//   });
// });

// // Update Attendance
// const updateAttendance = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await 
//   AttendanceServices.updateAttendance(id, req.body);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance updated successfully",
//     data: result,
//   });
// });

// // Delete Attendance
// const deleteAttendance = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await 
//   AttendanceServices.deleteAttendance(id);
//   sendResponse(res, {
//     status: 200,
//     success: true,
//     message: "Attendance deleted successfully",
//     data: result,
//   });
// });

// export const AttendanceControllers ={
//   createAttendance,
//   getAllAttendance,
//   getSingleAttendance,
//   updateAttendance,
//   deleteAttendance

// }
