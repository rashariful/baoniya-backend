import mongoose from "mongoose";
import { Student } from "./Student.model.js";
import generateStudentID from "../../utils/generateStudentId.js";
import { JwtHelpers } from "../../utils/jwtHelpers.js";
import { User } from "../user/user.model.js";
import generateDefaultPassword from "../../utils/generateDefaultPassword.js";

export const createStudentWithAcademicRecord = async (
  payload,
  externalSession = null
) => {
  const session = externalSession || (await mongoose.startSession());
  const isExternalSession = !!externalSession;

  if (!isExternalSession) {
    session.startTransaction();
  }

  try {
    const {
      name,
      email,
      phone,
      fatherName,
      motherName,
      guardianName,
      guardianPhone,
      classId,
      sectionId,
      sessionId,
      address,
      registrationNo,
      roll,
      status,
    } = payload;

    // Check if phone already exists
    const userExists = await User.findOne({ phone }).session(session);

    if (userExists) {
      throw new Error("A user already exists with this phone number");
    }

    console.log("User check passed. Proceeding to create user and student...");
    console.log("Phone:", phone);

    // Generate default password
    const plainPassword = generateDefaultPassword("student", phone);

    // Generate Student ID
    const studentId = await generateStudentID("STD", session);

    // Pre-generate ObjectIds
    const preGeneratedUserId = new mongoose.Types.ObjectId();
    const preGeneratedStudentId = new mongoose.Types.ObjectId();

    // Create User
    const userArr = await User.create(
      [
        {
          _id: preGeneratedUserId,
          email: email || undefined,
          phone,
          password: plainPassword,
          role: "student",
          profileId: preGeneratedStudentId,
          profileModel: "Student",
        },
      ],
      { session }
    );

    const newUser = userArr[0];

    // Create Student
    const studentArr = await Student.create(
      [
        {
          _id: preGeneratedStudentId,
          userId: preGeneratedUserId,
          studentId,
          name,
          roll,
          registrationNo,
          fatherName,
          motherName,
          guardianName,
          guardianPhone,
          classId,
          sectionId,
          sessionId,
          address,
          status: status || "active",
        },
      ],
      { session }
    );

    const newStudent = studentArr[0];

    // Generate Tokens
    const accessToken = JwtHelpers.generateAccessToken(newUser);
    const refreshToken = JwtHelpers.generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save({
      session,
      validateBeforeSave: false,
    });

    if (!isExternalSession) {
      await session.commitTransaction();
      session.endSession();
    }

    return {
      user: {
        _id: newUser._id,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      },
      student: newStudent,
      credentials: {
        phone: newUser.phone,
        password: plainPassword,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (!isExternalSession) {
      await session.abortTransaction();
      session.endSession();
    }

    throw error;
  }
};