import QueryBuilder from "../../helpers/QueryBuilder.js";
import { formatToBDDate, formatToBDTime } from "../../utils/timeFormatter.js";
import { Attendance } from "./Attendance.model.js";
import { SyncedEvent } from "../Hikvision/SyncedEvent.model.js";
import { Teacher } from "../Teacher/Teacher.model.js";
import { User } from "../user/user.model.js";
import { fetchAcsEvents } from "../Hikvision/Hikvision.client.js";
// import AppError from "../../errors/appError.js"; // apnar actual path onujayi adjust korben

// Duplicate IN diye vul kore check-out mark hoya thekano — 30 sec threshold
const MIN_GAP_SECONDS = 30;

// ---------------------------------------------------------
// 1. Standard CRUD & Manual Create
// ---------------------------------------------------------
const createAttendance = async (payload) => {
  const result = await Attendance.create(payload);
  return result;
};

// ---------------------------------------------------------
// 2. Mobile / App theke "Self Check-in"
// ---------------------------------------------------------
// ---------------------------------------------------------
// 2. Mobile / App theke "Self Check-in / Check-out"
// ---------------------------------------------------------
const markSelfAttendance = async (userId, payload = {}) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  // Today start
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const now = new Date();


  let attendance = await Attendance.findOne({
    userId,
    date: today,
  });



  // ===============================
  // Already attendance exists
  // => Check-out
  // ===============================

  if (attendance) {


    const lastSession =
      attendance.sessions[
        attendance.sessions.length - 1
      ];



    // Open session exists
    if (lastSession && !lastSession.checkOutTime) {


      lastSession.checkOutTime = now;

      attendance.checkOutTime = now;



      // Calculate session duration (minutes)
      const duration =
        (now - lastSession.checkInTime) / 60000;


      lastSession.duration =
        Math.round(duration);



      // Total working minutes

      attendance.totalWorkingMinutes =
        attendance.sessions.reduce(
          (total, session) =>
            total + (session.duration || 0),
          0
        );



      await attendance.save();

      return attendance;

    }


    // Previous session closed
    // Create new session

    attendance.sessions.push({

      checkInTime: now,

      checkOutTime: null,

    });


    attendance.checkInTime = attendance.checkInTime || now;


    await attendance.save();


    return attendance;

  }




  // ===============================
  // First time check-in
  // ===============================

  attendance = await Attendance.create({

    userId,

    date: today,

    status:
      payload.status || "present",


    source: "mobile",


    checkInTime: now,


    sessions: [
      {
        checkInTime: now,
        checkOutTime: null,
      }
    ],


    remarks:
      payload.remarks || "",

  });



  return attendance;

};


// ---------------------------------------------------------
// Hikvision Device Attendance
// Face / Fingerprint / Card Check-in & Check-out
// ---------------------------------------------------------


// ==========================================================
// Attendance status rule based on check-in time
//  <= 08:00        -> present
//  08:00 - 08:30   -> late   (30 min grace)
//  08:30 - 12:00   -> half-day
//  > 12:00         -> absent
// ==========================================================
const CHECK_IN_HOUR = 8;
const LATE_GRACE_MINUTES = 30;
const HALF_DAY_CUTOFF_HOUR = 12;

const getAttendanceStatus = (checkInTime) => {
  const dayStart = new Date(checkInTime);
  dayStart.setHours(CHECK_IN_HOUR, 0, 0, 0);

  const lateThreshold = new Date(dayStart);
  lateThreshold.setMinutes(lateThreshold.getMinutes() + LATE_GRACE_MINUTES);

  const halfDayCutoff = new Date(checkInTime);
  halfDayCutoff.setHours(HALF_DAY_CUTOFF_HOUR, 0, 0, 0);

  if (checkInTime <= dayStart) return "present";
  if (checkInTime <= lateThreshold) return "late";
  if (checkInTime <= halfDayCutoff) return "half-day";
  return "absent";
};

// method field এর জন্য valid enum ভ্যালুর বাইরে কিছু আসলে "unknown" এ ফলব্যাক
const VALID_METHODS = ["fingerprint", "face", "card", "manual", "unknown"];
const normalizeMethod = (method) =>
  VALID_METHODS.includes(method) ? method : "unknown";

function incrementMethodCount(attendance, method) {
  if (!attendance.methodCounts) {
    attendance.methodCounts = {};
  }
  attendance.methodCounts[method] =
    (attendance.methodCounts[method] || 0) + 1;
}

const markDeviceAttendance = async (payload) => {
  const {
    deviceUserId,
    deviceId,
    source, // "device" | "manual" | "mobile"
    method, // "fingerprint" | "face" | "card"
    timestamp,
  } = payload;

  if (!deviceUserId) {
    throw new Error("deviceUserId is required");
  }

  // Find teacher from Hikvision employee ID
  const teacher = await Teacher.findOne({
    deviceUserId: String(deviceUserId),
  });
  if (!teacher) {
    throw new Error(`No teacher found for deviceUserId: ${deviceUserId}`);
  }

  const scanTime = timestamp ? new Date(timestamp) : new Date();
  const scanMethod = normalizeMethod(method || "unknown");
  const scanSource = ["manual", "device", "mobile"].includes(source)
    ? source
    : "device";

  // Create day start
  const date = new Date(scanTime);
  date.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({
  userId: teacher._id,   // ✅ teacher.userId না, teacher._id
    date,
  });

  // =================================================
  // FIRST SCAN
  // CHECK-IN
  // =================================================
  if (!attendance) {
    const status = getAttendanceStatus(scanTime);

    attendance = await Attendance.create({
    userId: teacher._id,   // ✅ এখানেও teacher._id
      date,
      status,
      source: scanSource,
      deviceId: deviceId || null,
      checkInTime: scanTime,
      methodCounts: { [scanMethod]: 1 },
      sessions: [
        {
          checkInTime: scanTime,
          checkOutTime: null,
          duration: 0,
          checkInMethod: scanMethod,
        },
      ],
    });
    return attendance;
  }

  // =================================================
  // EXISTING ATTENDANCE
  // CHECK OUT OR NEW SESSION
  // =================================================
  const sessions = attendance.sessions || [];
  const lastSession = sessions[sessions.length - 1];

  // No session found
  if (!lastSession) {
    attendance.sessions.push({
      checkInTime: scanTime,
      checkOutTime: null,
      duration: 0,
      checkInMethod: scanMethod,
    });
    incrementMethodCount(attendance, scanMethod);
    await attendance.save();
    return attendance;
  }

  // =================================================
  // Duplicate scan protection
  // =================================================
  const diffSeconds = (scanTime - lastSession.checkInTime) / 1000;
  if (!lastSession.checkOutTime && diffSeconds < 30) {
    return attendance;
  }

  // =================================================
  // OPEN SESSION
  // => CHECK OUT
  // =================================================
  if (!lastSession.checkOutTime) {
    lastSession.checkOutTime = scanTime;
    lastSession.checkOutMethod = scanMethod;

    const duration = (scanTime - lastSession.checkInTime) / 60000;
    lastSession.duration = Math.round(duration);

    attendance.checkOutTime = scanTime;
  }
  // =================================================
  // CLOSED SESSION
  // => NEW CHECK-IN SESSION
  // =================================================
  else {
    attendance.sessions.push({
      checkInTime: scanTime,
      checkOutTime: null,
      duration: 0,
      checkInMethod: scanMethod,
    });
    attendance.checkOutTime = null;
  }

  incrementMethodCount(attendance, scanMethod);

  // =================================================
  // Calculate total working minutes
  // =================================================
  attendance.totalWorkingMinutes = attendance.sessions.reduce(
    (total, session) => total + (session.duration || 0),
    0
  );

  attendance.source = scanSource;
  attendance.deviceId = deviceId || attendance.deviceId;

  await attendance.save();
  return attendance;
};



// const markDeviceAttendance = async (payload) => {

//   const {
//     deviceUserId,
//     deviceId,
//     source,
//     timestamp,
//   } = payload;


//   if (!deviceUserId) {
//     throw new Error("deviceUserId is required");
//   }



//   // Find teacher from Hikvision employee ID

//   const teacher = await Teacher.findOne({
//     deviceUserId: String(deviceUserId),
//   });


//   if (!teacher) {
//     throw new Error(
//       `No teacher found for deviceUserId: ${deviceUserId}`
//     );
//   }



//   const scanTime = timestamp
//     ? new Date(timestamp)
//     : new Date();



//   // Create day start

//   const date = new Date(scanTime);

//   date.setHours(
//     0,
//     0,
//     0,
//     0
//   );



//   let attendance = await Attendance.findOne({
//     userId: teacher.userId,
//     date,
//   });



//   // =================================================
//   // FIRST SCAN
//   // CHECK-IN
//   // =================================================

//   if (!attendance) {


//     attendance = await Attendance.create({

//       userId: teacher.userId,

//       date,

//       status: "present",

//       source:
//         source || "device",


//       deviceId:
//         deviceId || null,


//       checkInTime: scanTime,


//       sessions: [
//         {
//           checkInTime: scanTime,
//           checkOutTime: null,
//           duration: 0,
//         }
//       ],

//     });


//     return attendance;

//   }




//   // =================================================
//   // EXISTING ATTENDANCE
//   // CHECK OUT OR NEW SESSION
//   // =================================================


//   const sessions = attendance.sessions || [];


//   const lastSession =
//     sessions[sessions.length - 1];



//   // No session found
//   if (!lastSession) {


//     attendance.sessions.push({

//       checkInTime: scanTime,

//       checkOutTime: null,

//       duration: 0,

//     });


//     await attendance.save();


//     return attendance;

//   }




//   // =================================================
//   // Duplicate scan protection
//   // =================================================

//   const diffSeconds =
//     (scanTime - lastSession.checkInTime) / 1000;



//   if (
//     !lastSession.checkOutTime &&
//     diffSeconds < 30
//   ) {

//     return attendance;

//   }





//   // =================================================
//   // OPEN SESSION
//   // => CHECK OUT
//   // =================================================

//   if (!lastSession.checkOutTime) {


//     lastSession.checkOutTime =
//       scanTime;



//     const duration =
//       (
//         scanTime -
//         lastSession.checkInTime
//       ) / 60000;



//     lastSession.duration =
//       Math.round(duration);



//     attendance.checkOutTime =
//       scanTime;



//   }



//   // =================================================
//   // CLOSED SESSION
//   // => NEW CHECK-IN SESSION
//   // =================================================

//   else {


//     attendance.sessions.push({

//       checkInTime: scanTime,

//       checkOutTime: null,

//       duration: 0,

//     });


//     attendance.checkOutTime =
//       null;


//   }




//   // =================================================
//   // Calculate total working minutes
//   // =================================================

//   attendance.totalWorkingMinutes =
//     attendance.sessions.reduce(
//       (total, session) =>
//         total +
//         (session.duration || 0),
//       0
//     );



//   attendance.source =
//     source || attendance.source;


//   attendance.deviceId =
//     deviceId || attendance.deviceId;



//   await attendance.save();



//   return attendance;

// };

// ---------------------------------------------------------
// 4. Background Cron / Manual Pull Sync from Hikvision Device
// ---------------------------------------------------------
const syncDeviceAttendance = async (deviceId = null) => {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(0, 0, 0, 0);

  const latestByUserDate = new Map();
  let position = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await fetchAcsEvents({
      deviceId, // Problem 2 fix: specific device pass korার option
      startTime,
      endTime: now,
      searchPosition: position,
      maxResults: 100,
    });

    const events = result?.events || [];

    if (events.length === 0) {
      hasMore = false;
      break;
    }

    // Problem 6 fix: sob serialNo ekbare batch query kore check kora
    const serials = events.map((e) => String(e.serialNo));
    const synced = await SyncedEvent.find({ serialNo: { $in: serials } });
    const syncedSet = new Set(synced.map((s) => s.serialNo));

    const newSyncedDocs = [];

    for (const event of events) {
      if (event.major !== 5 || event.minor !== 75 || !event.employeeNoString) continue;

      const serialNoStr = String(event.serialNo);
      if (syncedSet.has(serialNoStr)) continue;

      // Problem 4 fix: verify mode detection improved
      const mode = event.currentVerifyMode?.toLowerCase() || "";
      let source = "device";
      if (mode.includes("fp")) source = "fingerprint";
      else if (mode.includes("face")) source = "face";
      else if (mode.includes("card")) source = "card";

      try {
        const attendance = await markDeviceAttendance({
          deviceUserId: event.employeeNoString,
          deviceId: result.deviceId, // Problem 2 fix: hardcoded na, actual device-er ID
          source,
          timestamp: event.time,
        });

        newSyncedDocs.push({ serialNo: serialNoStr });

        const key = `${attendance.userId}-${attendance.date}`;
        latestByUserDate.set(key, attendance);
      } catch (err) {
        console.warn(`Skipped event for deviceUserId ${event.employeeNoString}: ${err.message}`);
        continue;
      }
    }

    // Batch insert synced events (duplicate key hole skip kore, tai ordered:false)
    if (newSyncedDocs.length > 0) {
      try {
        await SyncedEvent.insertMany(newSyncedDocs, { ordered: false });
      } catch (err) {
        // duplicate key errors ignore kora jay, baki insert hoye jabe
      }
    }

    // Problem 3 fix: events.length diye position barano, fixed 30 na
    position += events.length;
    hasMore = result.hasMore;
  }

  return Array.from(latestByUserDate.values());
};

// ---------------------------------------------------------
// 5. Advanced Get All with QueryBuilder & BD Time Formatting
// ---------------------------------------------------------
const getAllAttendance = async (query) => {
  const AttendanceSearchableFields = [];
  const resultQuery = new QueryBuilder(
    Attendance.find().populate({
      path: "userId", // Teacher._id
      select: "name thumbnail phone designation department userId",
      populate: {
        path: "userId", // Teacher.userId -> User
        select: "email role",
      },
    }),
    query
  )
    .search(AttendanceSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();

  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  const formattedData = result.map((att) => {
    const obj = att.toObject();
    return {
      ...obj,
      checkInTime: obj.checkInTime ? formatToBDTime(obj.checkInTime) : null,
      checkOutTime: obj.checkOutTime ? formatToBDTime(obj.checkOutTime) : null,
      date: formatToBDDate(obj.date),
    };
  });

  return { data: formattedData, meta };
};

const getSingleAttendance = async (id) => {
  const result = await Attendance.findById(id).populate("userId", "name email role");
  if (!result) {
    throw new (404, "Attendance not found"); // Problem 7 fix
  }
  return result;
};

const updateAttendance = async (id, payload) => {
  const result = await Attendance.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new (404, "Attendance not found"); // Problem 7 fix
  }
  return result;
};

const deleteAttendance = async (id) => {
  const result = await Attendance.findByIdAndDelete(id);
  if (!result) {
    throw new (404, "Attendance not found"); // Problem 7 fix
  }
  return result;
};

export const AttendanceServices = {
  createAttendance,
  markSelfAttendance,
  markDeviceAttendance,
  syncDeviceAttendance,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStatus
};
