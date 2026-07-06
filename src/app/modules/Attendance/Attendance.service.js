// import { Attendance } from "./attendance.model.js";
// import { User } from "../user/user.model.js"; // apnar actual path diye adjust korben
// import AppError from "../../errors/AppError.js"; // apnar existing error handler path diye adjust korben

import AppError from "../../errors/appError.js";
import { User } from "../user/user.model.js";
import { Attendance } from "./Attendance.model.js";

// ---------------------------------------------------------
// 1. Manual create (admin/app theke direct attendance create)
// ---------------------------------------------------------
const createAttendance = async (payload) => {
  const result = await Attendance.create(payload);
  return result;
};

// ---------------------------------------------------------
// 2. Mobile theke "self check-in" (Phase 1 testing er jonno)
//    User app open kore "Check In" button cholbe -> ei service call hobe
// ---------------------------------------------------------
const markSelfAttendance = async (userId, payload = {}) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Aaj already attendance ase ki na check
  let attendance = await Attendance.findOne({ userId, date: today });

  if (attendance) {
    // Already check-in ase, tahole eta check-out hisebe treat korbo
    attendance.checkOutTime = new Date();
    await attendance.save();
    return attendance;
  }

  attendance = await Attendance.create({
    userId,
    date: today,
    status: payload.status || "present",
    source: "manual",
    checkInTime: new Date(),
    remarks: payload.remarks,
  });

  return attendance;
};

// ---------------------------------------------------------
// 3. Device theke check-in (fingerprint/face device call korbe ei service)
//    deviceUserId = device e enrolled thaka user-er ID (User model er field)
// ---------------------------------------------------------
const markDeviceAttendance = async (payload) => {
  const { deviceUserId, deviceId, source, timestamp } = payload;

  if (!deviceUserId) {
    throw new AppError(400, "deviceUserId is required");
  }

  // User ke khuje pawa hocche deviceUserId diye
  // Note: User model e ekta "deviceUserId" field thaka lagbe (enrollment er somoy save kora)
  const user = await User.findOne({ deviceUserId });
  if (!user) {
    throw new AppError(404, "No user found for this device ID");
  }

  const scanTime = timestamp ? new Date(timestamp) : new Date();
  const date = new Date(scanTime);
  date.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({ userId: user._id, date });

  if (!attendance) {
    // Prothom scan = check-in
    attendance = await Attendance.create({
      userId: user._id,
      date,
      status: "present",
      source: source || "fingerprint",
      checkInTime: scanTime,
      deviceId,
    });
  } else {
    // Aage check-in hoye gele, ei scan ke check-out hisebe dhora hocche
    attendance.checkOutTime = scanTime;
    await attendance.save();
  }

  return attendance;
};

// ---------------------------------------------------------
// 4. Sob attendance dekha (filter shoho - userId, date range, role)
// ---------------------------------------------------------
const getAllAttendance = async (filters = {}) => {
  const query = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;

  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const result = await Attendance.find(query)
    .populate("userId", "name email role")
    .sort({ date: -1 });

  return result;
};

// ---------------------------------------------------------
// 5. Single attendance get by ID
// ---------------------------------------------------------
const getSingleAttendance = async (id) => {
  const result = await Attendance.findById(id).populate(
    "userId",
    "name email role"
  );
  if (!result) {
    throw new AppError(404, "Attendance not found");
  }
  return result;
};

// ---------------------------------------------------------
// 6. Update attendance (status/remarks etc.)
// ---------------------------------------------------------
const updateAttendance = async (id, payload) => {
  const result = await Attendance.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(404, "Attendance not found");
  }
  return result;
};

// ---------------------------------------------------------
// 7. Delete attendance
// ---------------------------------------------------------
const deleteAttendance = async (id) => {
  const result = await Attendance.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, "Attendance not found");
  }
  return result;
};

export const AttendanceServices = {
  createAttendance,
  markSelfAttendance,
  markDeviceAttendance,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
};


// import { Attendance } from "./Attendance.model.js";
// import QueryBuilder from "../../helpers/QueryBuilder.js";

// // Declare the Services 

// const createAttendance = async (payload) => {
//     const result = await Attendance.create(payload);
//     return result;
// }

// const getAllAttendance = async (query) => {
//     const AttendanceSearchableFields = [];
//     const resultQuery = new QueryBuilder(Attendance.find(), query).search(AttendanceSearchableFields).filter().sort().fields().paginate().limit();
//     const result = await resultQuery.modelQuery;
//     const meta = await resultQuery.countTotal();

//     return {
//         data: result,
//         meta
//     }
// }
// const getSingleAttendance = async (id) => {
//     const result = await Attendance.findById(id);
//     return result;
// }
// const updateAttendance = async (id, payload) => {
//     const result = await Attendance.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
//     return result;
// }
// const deleteAttendance = async (id) => {
//     const result = await Attendance.findByIdAndDelete(id);
//     return result;
// }

// export const AttendanceServices = {
//     createAttendance,
//     getAllAttendance,
//     getSingleAttendance,
//     updateAttendance,
//     deleteAttendance
// }
