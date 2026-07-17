// import { User } from "./user.model.js";
import { JwtHelpers } from "../../utils/jwtHelpers.js";
import { User } from "./user.model.js";
import mongoose from "mongoose";
import crypto from "crypto"; // ES Module

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { getPasswordResetEmailTemplate } from "../../utils/emailTemplates.js";
import { Teacher } from "../Teacher/Teacher.model.js";
import { Student } from "../Student/Student.model.js";


const registerUser = async ({
  name,
  email,
  password,
  role,
  phone,
  deviceUserId, // 🔥 NEW: fingerprint/face device er internal ID (optional)
}) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    deviceUserId, // 🔥 NEW: save kora hocche
  });

  const accessToken = JwtHelpers.generateAccessToken(user);
  const refreshToken = JwtHelpers.generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      deviceUserId: user.deviceUserId, // 🔥 NEW: response e o pathano hocche
    },
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, phone, password }) => {
  if (!password || (!email && !phone)) {
    throw new Error("Email or phone, and password are required");
  }

  // email ba phone jekono ekta diye khoja hobe
  const query = email ? { email: email.toLowerCase() } : { phone };

  const user = await User.findOne(query);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status !== "active") {
    throw new Error(`Account is ${user.status}. Please contact admin`);
  }

  const isValid = await user.matchPassword(password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = JwtHelpers.generateAccessToken(user);
  const refreshToken = JwtHelpers.generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return {
    user: {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileModel: user.profileModel,
      profileId: user.profileId,
      mustChangePassword: user.mustChangePassword,
    },
    accessToken,
    refreshToken,
  };
};
// login user  
// const loginUser = async ({ email, password }, req) => {
  
//   // user find
//   const user = await User.findOne({ email });
  
//   if (!user) {
//     throw new Error("User not found");
//   }
  
//   // password check
//   const isValid = await bcrypt.compare(
//     password,
//     user.password
//   );
  
//   if (!isValid) {
//     throw new Error("Invalid credentials");
//   }
  
//   // generate tokens
//   const accessToken =
//   JwtHelpers.generateAccessToken(user);
  
//   const refreshToken =
//     JwtHelpers.generateRefreshToken(user);
    
//     // 🔥 refresh token database এ save
//     user.refreshToken = refreshToken;
    
//     await user.save({
//       validateBeforeSave: false,
//   });
  
//   return {
//     userId: user._id,
//     email: user.email,
//     name: user.name,
//     accessToken,
//     refreshToken,
//   };
// };


// logout user 
// const registerUser = async ({
//   name,
//   email,
//   password,
//   role,
//   phone,
// }) => {
//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     throw new Error("User already exists");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role,
//     phone,
//   });

//   const accessToken = JwtHelpers.generateAccessToken(user);
//   const refreshToken = JwtHelpers.generateRefreshToken(user);

//   user.refreshToken = refreshToken;

//   await user.save({
//     validateBeforeSave: false,
//   });

//   return {
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phone: user.phone,
//     },
//     accessToken,
//     refreshToken,
//   };
// };

// Get all User
const getAllUser = async (query) => {
  const UserSearchableFields = [];
  const resultQuery = new QueryBuilder(
    User.find(),

    query,
  )
    .search(UserSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};
const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await User.findOneAndUpdate(
      { refreshToken: token },
      {
        refreshToken: null,
      }
    );
  }

  res.clearCookie("refreshToken");

  return {
    message: "Logged out successfully",
  };
};

// Update User
const updateUser = async (id, payload) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// update user profile 
const updateProfile = async (userId, file, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  let oldPhone = user.phone;

  // =========================
  // 📸 Handle thumbnail upload
  // =========================
  if (file?.buffer) {
    const filename = `profile${Date.now()}`;
    const { secure_url } = await sendImageToCloudinary(filename, file.buffer);
    user.thumbnail = secure_url;
  }

  // =========================
  // ✏️ Allowed fields update
  // =========================
  const allowedUpdates = ["name", "address", "phone", "email"];

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  // =========================
  // 🔥 SAVE USER
  // =========================
  await user.save();


  return user;
};

// get me 
const getMe = async (id) => {
  const user = await User.findById(id).select("-password -refreshToken -resetPasswordToken");

  if (!user) {
    throw new Error("User not found");
  }

  let profile = null;

  switch (user.profileModel) {
    case "Teacher":
      profile = await Teacher.findOne({ userId: user._id }).lean();
      break;
    case "Student":
      profile = await Student.findOne({ userId: user._id }).lean();
      break;
    // pore student, guardian etc add korben
    default:
      profile = null;
  }

  return {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileModel: user.profileModel,
    status: user.status,
    isActive: user.isActive,
    profile,
  };
};

// change password 
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");
  user.password = newPassword;

  await user.save(); // pre-save middleware auto hash করবে

  return { message: "Password changed successfully" };
};

const deleteUser = async (id) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const refreshToken = async (token) => {
  if (!token) {
    throw new Error("No refresh token");
  }

  // verify refresh token
  const decoded = JwtHelpers.verifyRefreshToken(token);

  // user find + refresh token match
  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: token,
  });

  if (!user) {
    throw new Error("Session expired");
  }

  // generate new tokens
  const newAccessToken = JwtHelpers.generateAccessToken(user);

  const newRefreshToken = JwtHelpers.generateRefreshToken(user);

  // rotate refresh token
  user.refreshToken = newRefreshToken;

await user.save({
  validateBeforeSave: false,
});

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// forgot password - Professional email version
const forgotPassword = async (email) => {
  

  const user = await User.findOne({ email });
  

if (!user) {
  return true; // নীরবে success return করো
}

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  // Get user's name (fallback to email if no name)
  const userName = user.name || user.email.split('@')[0];

  // Generate professional email template
  const emailHtml = getPasswordResetEmailTemplate(resetUrl, userName, 10);

await sendEmail({
  to: user.email,
  subject: "🔐 Reset Your Password",
  html: emailHtml,
});

  return true;
};

// reset password 
const resetPassword = async (token, password) => {
  try {
    // Validation
    // if (!password || password.length < 6) {
    //   throw new Error("Password must be at least 6 characters");
    // }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error("Token invalid or expired");
    }

    // ✅ Just assign plain password - pre-save middleware will hash automatically
    user.password = password;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save - pre-save middleware will hash the password
    await user.save();

    console.log("Password reset successful");
    return true;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};




export const AuthService = {
  getAllUser,
  registerUser,
  loginUser,
  refreshToken,
  logout,
  updateUser,
  getMe,
  updateProfile,
  changePassword,
  deleteUser,
  forgotPassword,
  resetPassword,
};
