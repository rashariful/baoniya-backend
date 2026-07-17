import mongoose from "mongoose";
import { User } from "../modules/user/user.model.js";
import { Teacher } from "../modules/Teacher/Teacher.model.js";
import { JwtHelpers } from "./jwtHelpers.js";
import generateTeacherID from "./generateTeacherID.js";
import generateDefaultPassword from "./generateDefaultPassword.js";

export const createTeacherWithCredentials = async (
  payload,
  externalSession = null
) => {
  let session;

  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected");
    }

    session = externalSession || (await mongoose.startSession());

    if (!externalSession) {
      session.startTransaction();
    }

    // Payload Destructuring
    const {
      thumbnail,
      name,
      email,
      phone,
      indexNumber, // Added
      designation,
      department,
      subject,
      qualification,
      teachingExperience,
      salary, // Object: { governmentSalary, schoolSalary }
      joinDate,
      schoolJoinDate,
      bio,
      alternativePhone,
      presentAddress,
      permanentAddress,
      emergencyContact,
      social, // Array
      education, // Array
      bankAccounts, // Array
      nid,
      birthCertificateNo,
      gender,
      dateOfBirth,
      bloodGroup,
      religion,
      maritalStatus,
      employmentType,
    } = payload;

    // Check if user exists
    const userExists = await User.findOne({ phone }).session(session);
    if (userExists) {
      throw new Error("Phone already exists");
    }

    // Generate credentials
    const plainPassword = generateDefaultPassword("teacher", phone);
    const teacherId = await generateTeacherID("TCH", session);

    const userId = new mongoose.Types.ObjectId();
    const teacherObjectId = new mongoose.Types.ObjectId();

    // Create User
    const user = new User({
      _id: userId,
      email: email || undefined,
      phone,
      password: plainPassword,
      role: "teacher",
      profileId: teacherObjectId,
      profileModel: "Teacher",
    });

    await user.save({ session });

    // Create Teacher
    const teacher = new Teacher({
      _id: teacherObjectId,
      userId,
      teacherId,
      indexNumber,
      thumbnail,
      name,
      phone,
      designation,
      department,
      subject,
      qualification,
      teachingExperience,
      salary, // Object format { governmentSalary, schoolSalary }
      joinDate,
      schoolJoinDate,
      bio,
      alternativePhone,
      presentAddress,
      permanentAddress,
      emergencyContact,
      social,
      education,
      bankAccounts,
      nid,
      birthCertificateNo,
      gender,
      dateOfBirth,
      bloodGroup,
      religion,
      maritalStatus,
      employmentType,
    });

    await teacher.save({ session });

    // JWT Handling
    const accessToken = JwtHelpers.generateAccessToken(user);
    const refreshToken = JwtHelpers.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({
      session,
      validateBeforeSave: false,
    });

    if (!externalSession) {
      await session.commitTransaction();
    }

    return {
      success: true,
      user,
      teacher,
      credentials: {
        phone,
        password: plainPassword,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("================ ERROR ================");
    console.error(error);

    if (session && !externalSession) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    if (session && !externalSession) {
      session.endSession();
    }
  }
};

// import mongoose from "mongoose";
// import { User } from "../modules/user/user.model.js";
// import { Teacher } from "../modules/Teacher/Teacher.model.js";
// import { JwtHelpers } from "./jwtHelpers.js";
// import generateTeacherID from "./generateTeacherID.js";
// import generateDefaultPassword from "./generateDefaultPassword.js";

// export const createTeacherWithCredentials = async (
//   payload,
//   externalSession = null
// ) => {
//   let session;

//   try {
    
    
    

//     if (mongoose.connection.readyState !== 1) {
//       throw new Error("MongoDB is not connected");
//     }

//     session = externalSession || (await mongoose.startSession());

    

//     if (!externalSession) {
//       session.startTransaction();
      
//     }

//     const {
//       thumbnail, // ✅ Added
//       name,
//       email,
//       phone,
//       designation,
//       department,
//       subject,
//       qualification,
//       teachingExperience,
//       salary,
//       joinDate,
//       schoolJoinDate,
//       bio,
//       alternativePhone,
//       presentAddress,
//       permanentAddress,
//       emergencyContact,
//       social,
//       education,
//       nid,
//       birthCertificateNo,
//       gender,
//       dateOfBirth,
//       bloodGroup,
//       religion,
//       maritalStatus,
//       bankName,
//       accountName,
//       accountNumber,
//       branchName,
//       routingNumber,
//       employmentType,
//     } = payload;

    
    

//     const userExists = await User.findOne({ phone }).session(session);

    

//     if (userExists) {
//       throw new Error("Phone already exists");
//     }

    

//     const plainPassword = generateDefaultPassword("teacher", phone);

    

    

//     const teacherId = await generateTeacherID("TCH", session);

    

//     const userId = new mongoose.Types.ObjectId();
//     const teacherObjectId = new mongoose.Types.ObjectId();

    

//     const user = new User({
//       _id: userId,
//       email: email || undefined,
//       phone,
//       password: plainPassword,
//       role: "teacher",
//       profileId: teacherObjectId,
//       profileModel: "Teacher",
//     });

//     await user.save({ session });

    

    

//     const teacher = new Teacher({
//       _id: teacherObjectId,
//       userId,
//       teacherId,

//       // ✅ Image
//       thumbnail,

//       // Personal
//       name,
//       phone,

//       // Professional
//       designation,
//       department,
//       subject,
//       qualification,
//       teachingExperience,
//       salary,
//       joinDate,
//       schoolJoinDate,
//       bio,

//       // Contact
//       alternativePhone,
//       presentAddress,
//       permanentAddress,
//       emergencyContact,

//       // Social & Education
//       social,
//       education,

//       // Identity
//       nid,
//       birthCertificateNo,
//       gender,
//       dateOfBirth,
//       bloodGroup,
//       religion,
//       maritalStatus,

//       // Bank
//       bankName,
//       accountName,
//       accountNumber,
//       branchName,
//       routingNumber,

//       // Employment
//       employmentType,
//     });

//     await teacher.save({ session });

    

    

//     const accessToken = JwtHelpers.generateAccessToken(user);
//     const refreshToken = JwtHelpers.generateRefreshToken(user);

//     user.refreshToken = refreshToken;

//     await user.save({
//       session,
//       validateBeforeSave: false,
//     });

    

//     if (!externalSession) {
//       await session.commitTransaction();
      
//     }

//     return {
//       success: true,
//       user,
//       teacher,
//       credentials: {
//         phone,
//         password: plainPassword,
//       },
//       accessToken,
//       refreshToken,
//     };
//   } catch (error) {
//     console.error("================ ERROR ================");
//     console.error(error);
//     console.error(error.stack);

//     if (session && !externalSession) {
//       await session.abortTransaction();
      
//     }

//     throw error;
//   } finally {
//     if (session && !externalSession) {
//       session.endSession();
      
//     }

    
//   }
// };

// import mongoose from "mongoose";
// import { User } from "../modules/user/user.model.js";
// import { Teacher } from "../modules/Teacher/Teacher.model.js";
// import { JwtHelpers } from "./jwtHelpers.js";
// import { generatePassword } from "./passwordgenerate.js";
// import generateTeacherID from "./generateTeacherID.js";
// import generateDefaultPassword from "./generateDefaultPassword.js";

// export const createTeacherWithCredentials = async (payload, externalSession = null) => {
//   const session = externalSession || (await mongoose.startSession());
//   const isExternalSession = !!externalSession;

//   if (!isExternalSession) session.startTransaction();

//   try {
//     const {
//       name,
//       email, // optional
//       phone, // required
//       designation,
//       department,
//       subject,
//       qualification,
//       teachingExperience,
//       salary,
//       joinDate,
//       schoolJoinDate,
//       bio,
//       alternativePhone,
//       presentAddress,
//       permanentAddress,
//       emergencyContact,
//       social,
//       education,
//       nid,
//       birthCertificateNo,
//       gender,
//       dateOfBirth,
//       bloodGroup,
//       religion,
//       maritalStatus,
//       bankName,
//       accountName,
//       accountNumber,
//       branchName,
//       routingNumber,
//       employmentType,
//     } = payload;

//     // 1️⃣ Phone duplicate check
//     const userExists = await User.findOne({ phone }).session(session);
//     if (userExists) {
//       throw new Error("A user already exists with this phone number");
//     }

//     // 2️⃣ Password + teacherId generate
//     const plainPassword = generateDefaultPassword("teacher", phone);

//     // const plainPassword = generatePassword(10);
//     const teacherId = await generateTeacherID("TCH", session);

//     // 3️⃣ Pre-generate ObjectId (chicken-egg problem solve)
//     const preGeneratedUserId = new mongoose.Types.ObjectId();
//     const preGeneratedTeacherId = new mongoose.Types.ObjectId();

//     // 4️⃣ User create
//     const userArr = await User.create(
//       [
//         {
//           _id: preGeneratedUserId,
//           email: email || undefined,
//           phone,
//           password: plainPassword,
//           role: "teacher",
//           profileId: preGeneratedTeacherId,
//           profileModel: "Teacher",
//         },
//       ],
//       { session }
//     );

//     const newUser = userArr[0];

//     // 5️⃣ Teacher create
//     const teacherArr = await Teacher.create(
//       [
//         {
//           _id: preGeneratedTeacherId,
//           userId: preGeneratedUserId,
//           teacherId,
//           name,
//           phone,
//           designation,
//           department,
//           subject,
//           qualification,
//           teachingExperience,
//           salary,
//           joinDate,
//           schoolJoinDate,
//           bio,
//           alternativePhone,
//           presentAddress,
//           permanentAddress,
//           emergencyContact,
//           social,
//           education,
//           nid,
//           birthCertificateNo,
//           gender,
//           dateOfBirth,
//           bloodGroup,
//           religion,
//           maritalStatus,
//           bankName,
//           accountName,
//           accountNumber,
//           branchName,
//           routingNumber,
//           employmentType,
//         },
//       ],
//       { session }
//     );

//     const newTeacher = teacherArr[0];

//     // 6️⃣ Token generate
//     const accessToken = JwtHelpers.generateAccessToken(newUser);
//     const refreshToken = JwtHelpers.generateRefreshToken(newUser);

//     newUser.refreshToken = refreshToken;
//     await newUser.save({ session, validateBeforeSave: false });

//     if (!isExternalSession) {
//       await session.commitTransaction();
//       session.endSession();
//     }

//     return {
//       user: {
//         _id: newUser._id,
//         phone: newUser.phone,
//         email: newUser.email,
//         role: newUser.role,
//       },
//       teacher: newTeacher,
//       credentials: {
//         phone: newUser.phone,
//         password: plainPassword,
//       },
//       accessToken,
//       refreshToken,
//     };
//   } catch (error) {
//     if (!isExternalSession) {
//       await session.abortTransaction();
//       session.endSession();
//     }
//     throw error;
//   }
// };

