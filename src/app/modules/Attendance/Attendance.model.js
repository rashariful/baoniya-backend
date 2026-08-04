import { Schema, model } from "mongoose";

const SessionSchema = new Schema(
  {
    checkInTime: {
      type: Date,
      required: true,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0, // minutes
    },

    // এই session এ check-in কোন method দিয়ে হয়েছে
    checkInMethod: {
      type: String,
      enum: ["fingerprint", "face", "card", "manual", "unknown"],
      default: "unknown",
    },

    // এই session এ check-out কোন method দিয়ে হয়েছে
    checkOutMethod: {
      type: String,
      enum: ["fingerprint", "face", "card", "manual", "unknown"],
      default: null,
    },
  },
  {
    _id: false,
  }
);

const AttendanceSchema = new Schema(
  {
  userId: {
  type: Schema.Types.ObjectId,
  ref: "Teacher",   // "User" থেকে বদলে "Teacher"
  required: true,
  index: true,
},

    date: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day", "leave"],
      default: "present",
      index: true,
    },

    // এটা শুধু "কোথা থেকে" data এসেছে (device / manual / mobile)
    source: {
      type: String,
      enum: ["manual", "device", "mobile"],
      default: "manual",
    },

    /**
     * First Entry Time
     */
    checkInTime: {
      type: Date,
      default: null,
    },

    /**
     * Final Exit Time
     */
    checkOutTime: {
      type: Date,
      default: null,
    },

    /**
     * Multiple Entry Exit
     */
    sessions: {
      type: [SessionSchema],
      default: [],
    },

    /**
     * Hikvision Device ID
     */
    deviceId: {
      type: String,
      default: null,
    },

    /**
     * দিনে কোন method কতবার ব্যবহার হয়েছে - reporting এর জন্য
     */
    methodCounts: {
      fingerprint: { type: Number, default: 0 },
      face: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      manual: { type: Number, default: 0 },
      unknown: { type: Number, default: 0 },
    },

    /**
     * Manual marked by admin
     */
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * Total working minutes
     */
    totalWorkingMinutes: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// One user one attendance per day
AttendanceSchema.index(
  {
    userId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// Faster report query
AttendanceSchema.index({
  date: 1,
  status: 1,
});

AttendanceSchema.index({
  source: 1,
});

export const Attendance = model("Attendance", AttendanceSchema);


// import { Schema, model } from "mongoose";

// const SessionSchema = new Schema(
//   {
//     checkInTime: {
//       type: Date,
//       required: true,
//     },

//     checkOutTime: {
//       type: Date,
//       default: null,
//     },

//     duration: {
//       type: Number,
//       default: 0, // minutes
//     },
//   },
//   {
//     _id: false,
//   }
// );


// const AttendanceSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },


//     date: {
//       type: Date,
//       required: true,
//       index: true,
//     },


//     status: {
//       type: String,
//       enum: [
//         "present",
//         "absent",
//         "late",
//         "half-day",
//         "leave",
//       ],
//       default: "present",
//       index: true,
//     },


//     source: {
//       type: String,
//       enum: [
//         "manual",
//         "device",
//         "fingerprint",
//         "face",
//         "card",
//         "mobile",
//       ],
//       default: "manual",
//     },


//     /**
//      * First Entry Time
//      */
//     checkInTime: {
//       type: Date,
//       default: null,
//     },


//     /**
//      * Final Exit Time
//      */
//     checkOutTime: {
//       type: Date,
//       default: null,
//     },


//     /**
//      * Multiple Entry Exit
//      */
//     sessions: {
//       type: [SessionSchema],
//       default: [],
//     },


//     /**
//      * Hikvision Device ID
//      */
//     deviceId: {
//       type: String,
//       default: null,
//     },


//     /**
//      * Manual marked by admin
//      */
//     markedBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },


//     /**
//      * Total working minutes
//      */
//     totalWorkingMinutes: {
//       type: Number,
//       default: 0,
//     },


//     remarks: {
//       type: String,
//       trim: true,
//       default: "",
//     },


//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },

//   },
//   {
//     timestamps:true,
//     versionKey:false,
//   }
// );


// // One user one attendance per day
// AttendanceSchema.index(
//   {
//     userId:1,
//     date:1,
//   },
//   {
//     unique:true,
//   }
// );


// // Faster report query
// AttendanceSchema.index({
//   date:1,
//   status:1,
// });


// AttendanceSchema.index({
//   source:1,
// });


// export const Attendance = model(
//   "Attendance",
//   AttendanceSchema
// );