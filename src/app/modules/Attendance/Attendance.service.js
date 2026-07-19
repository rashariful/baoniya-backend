// import { Attendance } from "./attendance.model.js";
// import { User } from "../user/user.model.js"; // apnar actual path diye adjust korben
// import AppError from "../../errors/AppError.js"; // apnar existing error handler path diye adjust korben

import AppError from "../../errors/appError.js";
import { formatToBDDate, formatToBDTime } from "../../utils/timeFormatter.js";
import { fetchAcsEvents } from "../Hikvision/Hikvision.client.js";
import { SyncedEvent } from "../Hikvision/SyncedEvent.model.js";
import { Teacher } from "../Teacher/Teacher.model.js";
import { User } from "../user/user.model.js";
import { Attendance } from "./Attendance.model.js";
// import { formatToBDTime, formatToBDDate } from "../../utils/timeFormatter.js"; // apnar actual path diye adjust korben

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

  const teacher = await Teacher.findOne({ deviceUserId });
  if (!teacher) {
    throw new AppError(404, `No teacher found for deviceUserId: ${deviceUserId}`);
  }

  const scanTime = timestamp ? new Date(timestamp) : new Date();
  const date = new Date(scanTime);
  date.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({ userId: teacher.userId, date });

  if (!attendance) {
    // ✅ Din-er prothom scan = notun session shuru (check-in)
    attendance = await Attendance.create({
      userId: teacher.userId,
      date,
      status: "present",
      source: source || "face",
      checkInTime: scanTime, // summary field
      deviceId,
      sessions: [{ checkInTime: scanTime }],
    });
  } else {
    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    if (lastSession && !lastSession.checkOutTime) {
      // ✅ Last session open ache -> ei scan take check-out hisebe close korbo
      lastSession.checkOutTime = scanTime;
      attendance.checkOutTime = scanTime; // summary field update
    } else {
      // ✅ Last session already closed -> notun session (check-in) shuru
      attendance.sessions.push({ checkInTime: scanTime });
    }

    await attendance.save();
  }

  return attendance;
};


// const markDeviceAttendance = async (payload) => {
//   const { deviceUserId, deviceId, source, timestamp } = payload;

//   if (!deviceUserId) {
//     throw new AppError(400, "deviceUserId is required");
//   }

//   // ✅ Teacher model e deviceUserId diye khoja hocche
//   const teacher = await Teacher.findOne({ deviceUserId });

//   if (!teacher) {
//     throw new AppError(404, `No teacher found for deviceUserId: ${deviceUserId}`);
//   }

//   const scanTime = timestamp ? new Date(timestamp) : new Date();
//   const date = new Date(scanTime);
//   date.setHours(0, 0, 0, 0);

//   let attendance = await Attendance.findOne({ userId: teacher.userId, date });

//   if (!attendance) {
//     attendance = await Attendance.create({
//       userId: teacher.userId, // ✅ Attendance schema e User er userId reference thake
//       date,
//       status: "present",
//       source: source || "face",
//       checkInTime: scanTime,
//       deviceId,
//     });
//   } else {
//     if (!attendance.checkOutTime || scanTime > attendance.checkOutTime) {
//       attendance.checkOutTime = scanTime;
//       await attendance.save();
//     }
//   }

//   return attendance;
// };

// const markDeviceAttendance = async (payload) => {
//   const { deviceUserId, deviceId, source, timestamp } = payload;

//   if (!deviceUserId) {
//     throw new AppError(400, "deviceUserId is required");
//   }

//   // ✅ biometricDevices array er bhitore deviceUserId khujbe, শুধু teacher role
//   const user = await User.findOne({
//     role: "teacher",
//     "biometricDevices.deviceUserId": deviceUserId,
//   });

//   if (!user) {
//     throw new AppError(404, `No teacher found for deviceUserId: ${deviceUserId}`);
//   }

//   const scanTime = timestamp ? new Date(timestamp) : new Date();
//   const date = new Date(scanTime);
//   date.setHours(0, 0, 0, 0);

//   let attendance = await Attendance.findOne({ userId: user._id, date });

//   if (!attendance) {
//     attendance = await Attendance.create({
//       userId: user._id,
//       date,
//       status: "present",
//       source: source || "fingerprint",
//       checkInTime: scanTime,
//       deviceId,
//     });
//   } else {
//     // Sob theke latest scan-ke checkOutTime hisebe rakhbo
//     if (!attendance.checkOutTime || scanTime > attendance.checkOutTime) {
//       attendance.checkOutTime = scanTime;
//       await attendance.save();
//     }
//   }

//   return attendance;
// };


// const markDeviceAttendance = async (payload) => {
//   const { deviceUserId, deviceId, source, timestamp } = payload;

//   if (!deviceUserId) {
//     throw new AppError(400, "deviceUserId is required");
//   }

//   // User ke khuje pawa hocche deviceUserId diye
//   // Note: User model e ekta "deviceUserId" field thaka lagbe (enrollment er somoy save kora)
// const user = await User.findOne({
//   role: "teacher",
//   "biometricDevices.deviceUserId": String(deviceUserId),
// });

// if (!user) {
//   throw new AppError(
//     404,
//     `No teacher found for deviceUserId: ${deviceUserId}`
//   );
// }

//   const scanTime = timestamp ? new Date(timestamp) : new Date();
//   const date = new Date(scanTime);
//   date.setHours(0, 0, 0, 0);

//   let attendance = await Attendance.findOne({ userId: user._id, date });

//   if (!attendance) {
//     // Prothom scan = check-in
//     attendance = await Attendance.create({
//       userId: user._id,
//       date,
//       status: "present",
//       source: source || "fingerprint",
//       checkInTime: scanTime,
//       deviceId,
//     });
//   } else {
//     // Aage check-in hoye gele, ei scan ke check-out hisebe dhora hocche
//     attendance.checkOutTime = scanTime;
//     await attendance.save();
//   }

//   return attendance;
// };

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



// ---------------------------------------------------------
// 8. Hikvision device theke event fetch kore attendance sync
// ---------------------------------------------------------
// import { SyncedEvent } from "../hikvision/syncedEvent.model.js";
const syncDeviceAttendance = async () => {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(0, 0, 0, 0);

  const latestByUserDate = new Map();

  let position = 0;
  let hasMore = true;

  while (hasMore) {
    // ✅ ekhon object destructure kore niচ্ছি: { events, hasMore }
    const result = await fetchAcsEvents({
      startTime,
      endTime: now,
      searchPosition: position,
      maxResults: 100,
    });

    const events = result.events;

    for (const event of events) {
      if (event.major !== 5 || event.minor !== 75 || !event.employeeNoString) continue;

      const alreadyProcessed = await SyncedEvent.findOne({ serialNo: event.serialNo });
      if (alreadyProcessed) continue;

      try {
        const attendance = await markDeviceAttendance({
          deviceUserId: event.employeeNoString,
          deviceId: "hik-device-1",
          source: "face",
          timestamp: event.time,
        });

        await SyncedEvent.create({ serialNo: event.serialNo });

        const key = `${attendance.userId}-${attendance.date}`;
        latestByUserDate.set(key, attendance);
      } catch (err) {
        console.warn(`Skipped event for deviceUserId ${event.employeeNoString}: ${err.message}`);
        continue;
      }
    }

    hasMore = result.hasMore;
    position += 30; // ✅ porer 30 ta event er jonno position barano
  }

  return Array.from(latestByUserDate.values());
};

// const syncDeviceAttendance = async () => {
//   const now = new Date();
//   const startTime = new Date(now);
//   startTime.setHours(0, 0, 0, 0);

//   const events = await fetchAcsEvents({
//     startTime,
//     endTime: now,
//     maxResults: 30,
//   });

//   const latestByUserDate = new Map();

//   for (const event of events) {
//     if (event.major !== 5 || event.minor !== 75 || !event.employeeNoString) continue;

//     // ✅ Ei event age process kora hoyeche ki na check
//     const alreadyProcessed = await SyncedEvent.findOne({ serialNo: event.serialNo });
//     if (alreadyProcessed) continue; // ✅ Already sync kora, skip

//     try {
//       const attendance = await markDeviceAttendance({
//         deviceUserId: event.employeeNoString,
//         deviceId: "hik-device-1",
//         source: "face",
//         timestamp: event.time,
//       });

//       // ✅ Ei event process kora hoyeche mark kore rakhbo
//       await SyncedEvent.create({ serialNo: event.serialNo });

//       const key = `${attendance.userId}-${attendance.date}`;
//       latestByUserDate.set(key, attendance);
//     } catch (err) {
//       console.warn(`Skipped event for deviceUserId ${event.employeeNoString}: ${err.message}`);
//       continue;
//     }
//   }

//   return Array.from(latestByUserDate.values());
// };


// const syncDeviceAttendance = async () => {
//   const now = new Date();
//   const startTime = new Date(now);
//   startTime.setHours(0, 0, 0, 0);

//   const events = await fetchAcsEvents({
//     startTime, // ✅ Date object সরাসরি, auto-format হয়ে যাবে
//     endTime: now,
//     maxResults: 30,
//   });

//   const results = [];
//   for (const event of events) {
//     if (event.major !== 5 || event.minor !== 75 || !event.employeeNoString) continue;

//     const attendance = await markDeviceAttendance({
//       deviceUserId: event.employeeNoString,
//       deviceId: "hik-device-1",
//       source: "face",
//       timestamp: event.time,
//     });
//     results.push(attendance);
//   }

//   return results;
// };
// const syncDeviceAttendance = async () => {
//   const now = new Date();

//   const startTime = new Date(now);
//   startTime.setHours(0, 0, 0, 0);

//   const events = await fetchAcsEvents({
//     startTime, // ❌ toISOString() নয়
//     endTime: now, // ❌ toISOString() নয়
//     maxResults: 30,
//   });

//   const results = [];

//   for (const event of events) {
//     if (event.major !== 5 || !event.employeeNoString) continue;

//     const attendance = await markDeviceAttendance({
//       deviceUserId: event.employeeNoString,
//       deviceId: "hik-device-1",
//       source: event.currentVerifyMode?.includes("fp")
//         ? "fingerprint"
//         : "face",
//       timestamp: event.time,
//     });

//     results.push(attendance);
//   }

//   return results;
// };

// ---------------------------------------------------------
// 4. Sob attendance dekha (filter shoho - userId, date range, role)
// ---------------------------------------------------------
const getAllAttendanceAll = async (filters = {}) => {
  const query = {};

  if (filters.userId) query.userId = filters.userId;
  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;

  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  } else if (filters.date) {
    // ✅ shudhu ekta specific date dile (e.g. "2026-07-18")
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const result = await Attendance.find(query)
    .populate("userId", "name email role")
    .sort({ date: -1 });

  // ✅ BD time e format kore pathano
  const formatted = result.map((att) => {
    const obj = att.toObject();
    return {
      ...obj,
      checkInTime: obj.checkInTime ? formatToBDTime(obj.checkInTime) : null,
      checkOutTime: obj.checkOutTime ? formatToBDTime(obj.checkOutTime) : null,
      date: formatToBDDate(obj.date),
    };
  });

  return formatted;
};


export const AttendanceServices = {
  createAttendance,
  markSelfAttendance,
  markDeviceAttendance,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  syncDeviceAttendance,
  getAllAttendanceAll
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
