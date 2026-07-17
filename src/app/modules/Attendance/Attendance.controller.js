// import { AttendanceServices } from "./attendance.service.js";
import catchAsync from "../../utils/catchAsync.js"; // apnar existing path diye adjust korben
import sendResponse from "../../utils/sendResponse.js"; // apnar existing path diye adjust korben
import { AttendanceServices } from "./Attendance.service.js";

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

// 2. Mobile theke self check-in/out (Phase 1 testing - fingerprint na thakleo eta diye test kora jabe)
const selfCheckIn = catchAsync(async (req, res) => {
  // req.user._id - apnar auth middleware theke logged-in user er id asbe
  // testing er somoy jodi auth setup na thake, req.body.userId diyeo pass kora jete pare
  const userId = req.user?._id || req.body.userId;

  const result = await AttendanceServices.markSelfAttendance(userId, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance marked successfully",
    data: result,
  });
});

// 3. Device theke check-in (fingerprint/face device ei endpoint e hit korbe)
const deviceCheckIn = catchAsync(async (req, res) => {
  const result = await AttendanceServices.markDeviceAttendance(req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Device attendance recorded successfully",
    data: result,
  });
});

// 4. Sob attendance (query filters: userId, status, source, startDate, endDate)
const getAllAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.getAllAttendance(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance retrieved successfully",
    data: result,
  });
});

// 5. Single attendance
const getSingleAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.getSingleAttendance(req.params.id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance retrieved successfully",
    data: result,
  });
});

// 6. Update
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

// 7. Delete
const deleteAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.deleteAttendance(req.params.id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Attendance deleted successfully",
    data: result,
  });
});

const syncDeviceAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceServices.syncDeviceAttendance();
  res.status(200).json({
    success: true,
    message: `${result.length} attendance records synced`,
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
  syncDeviceAttendance
};


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
