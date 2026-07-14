// import { AuthService } from "./auth.service.js";

import catchAsync from "../../utils/catchAsync.js";
import { JwtHelpers } from "../../utils/jwtHelpers.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthService } from "./authService.js";
import { User } from "./user.model.js";

// REGISTER
const register = async (req, res) => {
  try {


    const result = await AuthService.registerUser(req.body);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all User
const getAllUser = catchAsync(async (req, res) => {
  const result = await AuthService.getAllUser(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "All User fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const login = async (req, res) => {
  try {
    const result = await AuthService.loginUser(req.body, req);

   // ✅ ঠিক করা — environment দিয়ে control করো
res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        accessToken: result.accessToken,
      },
    });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};






// Google/Facebook callback এর পর এই function call হবে
 const socialAuthCallback = async (req, res) => {
  try {
    const user = req.user; // passport strategy থেকে আসবে

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=auth_failed`
      );
    }

    // JWT generate করো
    const accessToken = JwtHelpers.generateAccessToken(user);
    const refreshToken = JwtHelpers.generateRefreshToken(user);

    // Refresh token DB তে save করো
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Cookie set করো
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Frontend এ redirect করো — accessToken URL এ দাও
    // Frontend এটা পেয়ে localStorage এ রাখবে
    res.redirect(
      `${process.env.CLIENT_URL}/auth/social-success?token=${accessToken}`
    );
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};





// LOGOUT
const logout = async (req, res) => {
  try {
    const result = await AuthService.logout(req, res);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const result = await AuthService.updateProfile(
      req.user._id,
      req.file,
      req.body,
    );

    sendResponse(res, {
      status: 200,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AuthService.deleteUser(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

// ✅ Service use করো
// const getMe = catchAsync(async (req, res) => {
//   const result = await AuthService.getMe(req.user._id);
//   sendResponse(res, { 
//     status: 200, 
//     success: true, 
//     data: result });
// });

const getMe = async (req, res) => {
  try {
    const data = await AuthService.getMe(req.user.id); // req.user.id verifyToken theke ashe
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const result = await AuthService.refreshToken(token);

    // ✅ ঠিক করা — environment দিয়ে control করো
res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    const result = await AuthService.changePassword(
      req.user._id,
      currentPassword,
      newPassword,
    );

    sendResponse(res, {
    status: 200,
    success: true,
    message: "successfully Change Password",
    data: result,
  });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};






// forgot password
 const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    await AuthService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "Reset email sent"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// reset password
 const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;

    await AuthService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


export const AuthController = {
  getAllUser,
  register,
  login,
  logout,

  deleteUser,
  getMe,
  refreshToken,
  updateProfile,
  changePassword,
  resetPassword,
  forgotPassword,
  socialAuthCallback
};
