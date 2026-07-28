
import { ExamResult } from "./ExamResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { Student } from "../Student/Student.model.js";
import { GradingEngine } from "../GradingScale/GradingEngine.service.js";

// Declare the Services 
const createExamResultWithGrading = async (payload) => {
  const { studentId, examId, sessionId, classGroupId, marksInput } = payload;

  const subjectResults = [];
  for (const item of marksInput) {
    const result = await GradingEngine.calculateSubjectResult(item);
    subjectResults.push(result);
  }

  const { overallStatus, gpa } = await GradingEngine.calculateOverallResult({
    subjectResults,
    classGroupId,
  });

  const examResult = await ExamResult.create({
    studentId, examId, sessionId,
    subjects: subjectResults,
    overallStatus, gpa,
  });

  return examResult;
};


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

// শেয়ার্ড হেল্পার — একটা student+exam-এর ডকুমেন্টে একটা/একাধিক subject upsert করা
const upsertSubjectsIntoResult = async ({ studentId, examId, sessionId, classGroupId, subjectEntries }) => {
  // subjectEntries = [{ subjectId, marksObj, isAbsent }]
  const calculatedSubjects = [];
  for (const item of subjectEntries) {
    const result = await GradingEngine.calculateSubjectResult(item);
    calculatedSubjects.push(result);
  }

  let examResult = await ExamResult.findOne({ studentId, examId, sessionId });

  if (!examResult) {
    // প্রথমবার — নতুন ডকুমেন্ট বানাও শুধু এই subject(গুলো) দিয়ে
    examResult = new ExamResult({ studentId, examId, sessionId, subjects: calculatedSubjects });
  } else {
    // আগে থেকে আছে — শুধু এই subject(গুলো) replace/add করো, বাকিগুলো অক্ষত থাকবে
    for (const newSub of calculatedSubjects) {
      const idx = examResult.subjects.findIndex(
        (s) => s.subjectId.toString() === newSub.subjectId.toString()
      );
      if (idx >= 0) examResult.subjects[idx] = newSub;   // update existing subject entry
      else examResult.subjects.push(newSub);              // নতুন subject যোগ
    }
  }

  // সব subject মিলিয়ে overall status/gpa recalculate (যতগুলো subject এখন পর্যন্ত ঢুকেছে তার ভিত্তিতে)
  const { overallStatus, gpa } = await GradingEngine.calculateOverallResult({
    subjectResults: examResult.subjects,
    classGroupId,
  });
  examResult.overallStatus = overallStatus;
  examResult.gpa = gpa;

  await examResult.save();
  return examResult;
};

// ১. Mode A — এক স্টুডেন্টের সব সাবজেক্ট একসাথে
const submitStudentAllSubjects = async ({ studentId, examId, sessionId, classGroupId, marksInput }) => {
  return upsertSubjectsIntoResult({
    studentId, examId, sessionId, classGroupId,
    subjectEntries: marksInput,
  });
};

// ২. Mode B — এক সাবজেক্টের সব স্টুডেন্ট একসাথে (bulk)
const submitSubjectAllStudents = async ({ examId, sessionId, classGroupId, subjectId, entries }) => {
  const results = [];
  for (const entry of entries) {
    const { studentId, marksObj, isAbsent } = entry;
    const result = await upsertSubjectsIntoResult({
      studentId, examId, sessionId, classGroupId,
      subjectEntries: [{ subjectId, marksObj, isAbsent }],
    });
    results.push(result);
  }
  return results;
};

export const ExamResultServices = {
    createExamResult,
    getAllExamResult,
    getSingleExamResult,
    updateExamResult,
    deleteExamResult,
    getStudentResultByStudentId,
    createExamResultWithGrading   ,
      submitSubjectAllStudents,
  submitStudentAllSubjects
}
