import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    // =========================
    // Authentication
    // =========================
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      minlength: 6,
      required: true,
    },

    // =========================
    // Role
    // =========================
    role: {
      type: String,
      enum: [
        "superAdmin",
        "admin",
        "manager",
        "teacher",
        "student",
        "guardian",
        "accountant",
        "librarian",
        "staff",
      ],
      required: true,
    },

    // =========================
    // Profile Relation
    // =========================
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },

    profileModel: {
      type: String,
      enum: [
        "Admin",
        "Teacher",
        "Student",
        "Guardian",
        "Manager",
        "Accountant",
        "Librarian",
        "Staff",
      ],
      // required: true,
    },

    // =========================
    // Social Login
    // =========================
    googleId: {
      type: String,
      default: null,
    },

    facebookId: {
      type: String,
      default: null,
    },

    // =========================
    // Account Status
    // =========================
    status: {
      type: String,
      enum: ["active", "blocked", "suspended"],
      default: "active",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    // =========================
    // Attendance Device
    // =========================
    biometricDevices: [
      {
        deviceName: String,      // Main Gate Device
        deviceId: String,        // Device Serial
        deviceUserId: String,    // User ID inside device
        fingerprintId: String,   // Finger ID
        faceId: String,          // Face ID
        cardId: String,          // RFID Card
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // =========================
    // Token
    // =========================
    refreshToken: String,

    resetPasswordToken: String,

    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", UserSchema);



// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     googleId: {
//       type: String,
//       default: null,
//     },

//     facebookId: {
//       type: String,
//       default: null,
//     },

//     // password optional (social login user der password nai)
//     password: {
//       type: String,
//       minlength: 6,
//     },

//     // 🔥 UPDATED: attendance system er jonno role enum
//     role: {
//       type: String,
//       enum: ["admin", "manager", "teacher", "student", "mentor"],
//       default: "student",
//     },

//     status: {
//       type: String,
//       enum: ["active", "blocked", "suspended"],
//       default: "active",
//     },

//     thumbnail: {
//       type: String,
//       default: "",
//     },


//     phone: {
//       type: String,
//       default: "",
//       index: true,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },

//     // 🔥 NEW: Fingerprint/Face device er internal user ID
//     // Device e enroll korar somoy ja ID generate hobe, seta ekhane save thakbe
//     deviceUserId: {
//       type: String,
//       default: null,
//       index: true, // device theke fast lookup korar jonno
//     },

//     refreshToken: String,
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true }
// );

// UserSchema.pre("save", async function (next) {
//   if (!this.password || !this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// export const User = mongoose.model("User", UserSchema);

