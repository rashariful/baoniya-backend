import mongoose from "mongoose";
import { Student } from "./Student.model.js";
import { StudentAcademicRecord } from "../StudentAcademicRecord/StudentAcademicRecord.model.js";
// import { Student } from "./Student.model.js";
// import { StudentAcademicRecord } from "../StudentAcademicRecord/StudentAcademicRecord.model.js";

export const createStudentWithAcademicRecord = async (payload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      name,
      fatherName,
      motherName,
      phone,
      address,

      classId,
      sectionId,
      sessionId,
      roll,
    } = payload;

    // ==========================
    // Create Student
    // ==========================

    const [student] = await Student.create(
      [
        {
          name,
          fatherName,
          motherName,
          phone,
          address,

          // যদি Student model-এ এগুলো এখনও রাখো
          classId,
          sectionId,
          sessionId,
          roll,
        },
      ],
      { session }
    );

    // ==========================
    // Create Academic Record
    // ==========================

    await StudentAcademicRecord.create(
      [
        {
          studentId: student._id,
          classId,
          sectionId,
          sessionId,
          roll,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return student;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};