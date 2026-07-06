import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    // Generic reference - kaj korbe admin, manager, teacher, student sobar jonno
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    date: { type: Date, required: true },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },

    // Attendance kibhabe mark hoyeche - future-proof field
    // manual = mobile/admin theke hand-e mark kora
    // fingerprint = fingerprint device theke
    // face = face recognition device theke
    source: {
      type: String,
      enum: ["manual", "fingerprint", "face"],
      default: "manual",
    },

    // Device theke deta asle check-in / check-out time track korar jonno
    checkInTime: { type: Date },
    checkOutTime: { type: Date },

    // Kon device theke asche (jokon multiple device thakbe, track korar jonno)
    deviceId: { type: String },

    // Kon user (admin/teacher) ata mark korlo (manual hole) - optional
    markedBy: { type: Schema.Types.ObjectId, ref: "User" },

    remarks: { type: String },
  },
  { timestamps: true }
);

// Same user, same date - duplicate attendance entry rokhar jonno
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Attendance = model("Attendance", AttendanceSchema);


// import { Schema, model } from "mongoose";

// const AttendanceSchema = new Schema(
//   {
//     studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
//     date: { type: Date, required: true },

//     status: {
//       type: String,
//       enum: ["present", "absent", "late"],
//       default: "present",
//     },
//   },
//   { timestamps: true }
// );

// export const Attendance = model("Attendance", AttendanceSchema);