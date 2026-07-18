
import { ExamResult } from "./ExamResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { Student } from "../Student/Student.model.js";

// Declare the Services 

const createExamResult = async (payload) => {
    const result = await ExamResult.create(payload);
    return result;
}


const getAllExamResult = async (query) => {
  const ExamResultSearchableFields = [];

  const resultQuery = new QueryBuilder(ExamResult.find(), query)
    .search(ExamResultSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();

  resultQuery.modelQuery = resultQuery.modelQuery.populate([
    {
      path: "studentId",
      select: "studentId name roll classId sectionId"
    },
    {
      path: "examId",
      select: "name examType startDate endDate"
    },
    {
      path: "sessionId",
      select: "name year status"
    },
    {
      path: "subjects.subjectId",
      select: "name code fullMarks passMarks"
    }
  ]);

  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

// const getAllExamResult = async (query) => {
//     const ExamResultSearchableFields = [];
//     const resultQuery = new QueryBuilder(ExamResult.find(), query).search(ExamResultSearchableFields).filter().sort().fields().paginate().limit();
//     const result = await resultQuery.modelQuery;
//     const meta = await resultQuery.countTotal();

//     return {
//         data: result,
//         meta
//     }
// }

const getSingleExamResult = async (id) => {
    const result = await ExamResult.findById(id);
    return result;
}
const updateExamResult = async (id, payload) => {
    const result = await ExamResult.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteExamResult = async (id) => {
    const result = await ExamResult.findByIdAndDelete(id);
    return result;
}


const getStudentResultByStudentId = async (
  studentId
) => {

  // প্রথমে student খুঁজবেন
  const student = await Student.findOne({
    studentId: studentId
  });

  console.log(student)

  if (!student) {
    throw new Error("Student not found");
  }


  // তারপর ExamResult খুঁজবেন
  const result = await ExamResult.find({
    studentId: student._id
  })
    .populate({
      path:"studentId",
      select:"studentId name roll classId sectionId"
    })
    .populate("sessionId")
    .populate("examId")
    .populate({
      path:"subjects.subjectId",
      select:"name code fullMarks passMarks"
    });


  return result;
};


export const ExamResultServices = {
    createExamResult,
    getAllExamResult,
    getSingleExamResult,
    updateExamResult,
    deleteExamResult,
    getStudentResultByStudentId
}
