
import mongoose from "mongoose";
import { Student } from "./Student.model.js";
import { StudentAcademicRecord } from "../StudentAcademicRecord/StudentAcademicRecord.model.js";
import generateStudentID from "../../utils/generateStudentId.js";
import { generatePassword } from "../../utils/passwordgenerate.js";
import { JwtHelpers } from "../../utils/jwtHelpers.js";
import { User } from "../user/user.model.js";
import generateDefaultPassword from "../../utils/generateDefaultPassword.js";




export const createStudentWithAcademicRecord = async (payload, externalSession = null) => {
  const session = externalSession || (await mongoose.startSession());
  const isExternalSession = !!externalSession;

  if (!isExternalSession) session.startTransaction();

  try {
    const {
      name,
      email, // optional
      phone, // required
      fatherName,
      motherName,
      classId,
      sectionId,
      sessionId,
      address,
      registrationNo,
      roll,
    } = payload;

    // 1️⃣ Phone already exists kina check (User model e phone unique)
    const userExists = await User.findOne({ phone }).session(session);
    if (userExists) {
      throw new Error("A user already exists with this phone number");
    }
console.log(userExists,"User check passed. Proceeding to create user and student...");
    console.log(phone,"Phone check passed. Proceeding to create user and student...");
    // 2️⃣ Password generate
    const plainPassword = generateDefaultPassword("student", phone);

    // const plainPassword = generatePassword(10);

    // 3️⃣ studentId generate (session pass kora holo — atomic)
    const studentId = await generateStudentID("STD", session);

    // 4️⃣ 🔥 _id pre-generate kora holo — chicken-egg problem solve
    const preGeneratedUserId = new mongoose.Types.ObjectId();
    const preGeneratedStudentId = new mongoose.Types.ObjectId();

    // 5️⃣ User create — profileId, profileModel shoho ekbare e full data
    const userArr = await User.create(
      [
        {
          _id: preGeneratedUserId,
          email: email || undefined, // sparse unique, na thakle undefined rakho (null dile duplicate error hote pare)
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

    // 6️⃣ Student create
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
          classId,
          sectionId,
          sessionId,
          address,
        },
      ],
      { session }
    );

    const newStudent = studentArr[0];

    // 7️⃣ Token generate
    const accessToken = JwtHelpers.generateAccessToken(newUser);
    const refreshToken = JwtHelpers.generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save({ session, validateBeforeSave: false });

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

// import mongoose from "mongoose";
// import { Student } from "./Student.model.js";
// import { StudentAcademicRecord } from "../StudentAcademicRecord/StudentAcademicRecord.model.js";
// // import { Student } from "./Student.model.js";
// // import { StudentAcademicRecord } from "../StudentAcademicRecord/StudentAcademicRecord.model.js";


// // import generateStudentID from "../utils/generateStudentID.js";
// // import { generatePassword } from "../utils/generatePassword.js";
// // import { JwtHelpers } from "../helpers/jwtHelpers.js";
// import generateStudentID from "../../utils/generateStudentId.js";
// import { generatePassword } from "../../utils/passwordgenerate.js";
// import { JwtHelpers } from "../../utils/jwtHelpers.js";
// import { User } from "../user/user.model.js";

// export const createStudentWithAcademicRecord = async (payload) => {
//   const {
//     name,
//     email,
//     phone,
//     fatherName,
//     motherName,
//     classId,
//     sectionId,
//     sessionId,
//     address,
//     registrationNo,
//   } = payload;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 1️⃣ Email check
//     const userExists = await User.findOne({ email }).session(session);
//     if (userExists) {
//       throw new Error("User already exists with this email");
//     }

//     // 2️⃣ Password generate
//     const plainPassword = generatePassword(10);

//     // 3️⃣ Auth user create
//     const userArr = await User.create(
//       [
//         {
//           email,
//           password: plainPassword, // pre-save hook e hash hobe
//           role: "student",
//         },
//       ],
//       { session }
//     );

//     const newUser = userArr[0];

//     // 4️⃣ StudentId generate (session pass kora holo — atomic)
//     const studentId = await generateStudentID("STD", session);

//     // 5️⃣ Student profile create
//     const studentArr = await Student.create(
//       [
//         {
//           userId: newUser._id,
//           studentId,
//           name,
//           phone,
//           fatherName,
//           motherName,
//           classId,
//           sectionId,
//           sessionId,
//           address,
//           registrationNo,
//         },
//       ],
//       { session }
//     );

//     const newStudent = studentArr[0];

//     // 6️⃣ Token generate
//     const accessToken = JwtHelpers.generateAccessToken(newUser);
//     const refreshToken = JwtHelpers.generateRefreshToken(newUser);

//     newUser.refreshToken = refreshToken;
//     await newUser.save({ session, validateBeforeSave: false });

//     await session.commitTransaction();
//     session.endSession();

//     return {
//       user: {
//         _id: newUser._id,
//         email: newUser.email,
//         role: newUser.role,
//       },
//       student: newStudent,
//       credentials: {
//         email: newUser.email,
//         password: plainPassword, // 🔥 shudhu ekhane e plain thakbe
//       },
//       accessToken,
//       refreshToken,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };



// export const createStudentWithAcademicRecord = async (payload) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const {
//       name,
//       fatherName,
//       motherName,
//       phone,
//       address,

//       classId,
//       sectionId,
//       sessionId,
//       roll,
//     } = payload;

//     // ==========================
//     // Create Student
//     // ==========================

//     const [student] = await Student.create(
//       [
//         {
//           name,
//           fatherName,
//           motherName,
//           phone,
//           address,

//           // যদি Student model-এ এগুলো এখনও রাখো
//           classId,
//           sectionId,
//           sessionId,
//           roll,
//         },
//       ],
//       { session }
//     );

//     // ==========================
//     // Create Academic Record
//     // ==========================

//     await StudentAcademicRecord.create(
//       [
//         {
//           studentId: student._id,
//           classId,
//           sectionId,
//           sessionId,
//           roll,
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();

//     return student;
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };