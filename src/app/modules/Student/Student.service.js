import { Student } from "./Student.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { createStudentWithAcademicRecord } from "./student.utils.js";
import { User } from "../user/user.model.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";
// import { createStudentWithAcademicRecord } from "./student.utils.js";

// Declare the Services
const createStudent = async (file, payload) => {

  try {
    if (file?.buffer) {
    
      const imageName = `student-${Date.now()}`;

      const uploadResult = await sendImageToCloudinary(
        imageName,
        file.buffer
      );

      payload.thumbnail = uploadResult.secure_url;

    
    }

    const result = await createStudentWithAcademicRecord(payload);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// const createStudent = async (payload) => {
//   const result = await createStudentWithAcademicRecord(payload);

//   return result;
// };
// const createStudent = async (payload) => {
//     const result = await Student.create(payload);
//     return result;
// }
const getAllStudent = async (query) => {
  const StudentSearchableFields = ["name", "roll", "phone"];

  const resultQuery = new QueryBuilder(
    Student.find()
      .populate("classId")
      .populate("sectionId")
      .populate("sessionId")
      .populate({
        path: "userId",
        select: "-password -refreshToken",
      }),
    query,
  )
    .search(StudentSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};
const getSingleStudent = async (id) => {
  const result = await Student.findById(id);
  return result;
};

const updateStudent = async (id, file, payload) => {
  try {
    if (file?.buffer) {
      const imageName = `student-${Date.now()}`;
      const { secure_url } = await sendImageToCloudinary(
        imageName,
        file.buffer
      );

      payload.thumbnail = secure_url;
    }

    const result = await Student.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};



const deleteStudent = async (id) => {
  const result = await Student.findByIdAndDelete(id);
  return result;
};

export const StudentServices = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
