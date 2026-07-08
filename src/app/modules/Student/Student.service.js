import { Student } from "./Student.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { createStudentWithAcademicRecord } from "./student.utils.js";
// import { createStudentWithAcademicRecord } from "./student.utils.js";

// Declare the Services
const createStudent = async (payload) => {
  const result = await createStudentWithAcademicRecord(payload);

  return result;
};
// const createStudent = async (payload) => {
//     const result = await Student.create(payload);
//     return result;
// }
const getAllStudent = async (query) => {
  const StudentSearchableFields = ["name", "roll", "phone"];
  const resultQuery = new QueryBuilder(
    Student.find().populate("classId"),
    query,
  )
    .search(StudentSearchableFields)
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
const getSingleStudent = async (id) => {
  const result = await Student.findById(id);
  return result;
};
const updateStudent = async (id, payload) => {
  const result = await Student.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
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
