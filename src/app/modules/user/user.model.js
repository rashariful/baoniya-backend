import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    googleId: {
      type: String,
      default: null,
    },

    facebookId: {
      type: String,
      default: null,
    },

    // password optional (social login user der password nai)
    password: {
      type: String,
      minlength: 6,
    },

    // 🔥 UPDATED: attendance system er jonno role enum
    role: {
      type: String,
      enum: ["admin", "manager", "teacher", "student", "mentor"],
      default: "student",
    },

    status: {
      type: String,
      enum: ["active", "blocked", "suspended"],
      default: "active",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // 🔥 NEW: Fingerprint/Face device er internal user ID
    // Device e enroll korar somoy ja ID generate hobe, seta ekhane save thakbe
    deviceUserId: {
      type: String,
      default: null,
      index: true, // device theke fast lookup korar jonno
    },

    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", UserSchema);

