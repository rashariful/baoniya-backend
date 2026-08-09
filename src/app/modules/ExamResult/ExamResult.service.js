
import { ExamResult } from "./ExamResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { Student } from "../Student/Student.model.js";
import { GradingEngine } from "../GradingScale/GradingEngine.service.js";
import mongoose from "mongoose";
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
      select: "studentId name roll classId sectionId thumbnail"
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

// ক্লাসের মধ্যে প্রতিটা সাবজেক্টে সর্বোচ্চ নম্বর (একটা exam-ভিত্তিক)
const getHighestMarksPerSubject = async ({ examId }) => {
  const results = await ExamResult.aggregate([
    { $match: { examId: new mongoose.Types.ObjectId(examId) } },
    { $unwind: "$subjects" },
    {
      $group: {
        _id: "$subjects.subjectId",
        highestMark: { $max: "$subjects.total" },
      },
    },
    {
      $lookup: {
        from: "subjects", // ⚠️ MongoDB collection নাম lowercase+plural হয় সাধারণত, চেক করে নাও
        localField: "_id",
        foreignField: "_id",
        as: "subjectInfo",
      },
    },
    { $unwind: "$subjectInfo" },
    {
      $project: {
        _id: 0,
        subjectId: "$_id",
        subjectName: "$subjectInfo.name",
        highestMark: 1,
      },
    },
  ]);

  return results; // [{ subjectId, subjectName, highestMark }, ...]
};

// import { Student } from "../Student/Student.model.js";

// standard competition ranking (1,1,3 style) — sorted array থেকে position ম্যাপ বানায়
const buildRankMap = (sortedList) => {
  const rankMap = new Map();
  let lastValue = null;
  let lastRank = 0;
  sortedList.forEach((item, idx) => {
    if (item.totalMarks !== lastValue) {
      lastRank = idx + 1;
      lastValue = item.totalMarks;
    }
    rankMap.set(item.resultId.toString(), lastRank);
  });
  return rankMap;
};

const calculatePositions = async ({ examId }) => {
  const results = await ExamResult.find({ examId }).populate({
    path: "studentId",
    select: "classId sectionId",
  });

  if (!results.length) {
    throw new Error("এই exam-এর জন্য কোনো ExamResult পাওয়া যায়নি");
  }

  // প্রতিটা result-এর totalMarks বের করা (সব subject-এর total যোগফল)
  const withTotals = results.map((r) => ({
    resultId: r._id,
    classId: r.studentId?.classId?.toString(),
    sectionId: r.studentId?.sectionId?.toString(),
    totalMarks: (r.subjects || []).reduce((sum, s) => sum + (s.total || 0), 0),
  }));

  // ---- Section-wise ranking ----
  const bySection = {};
  withTotals.forEach((item) => {
    if (!item.sectionId) return;
    if (!bySection[item.sectionId]) bySection[item.sectionId] = [];
    bySection[item.sectionId].push(item);
  });

  const sectionRankMap = new Map();
  Object.values(bySection).forEach((group) => {
    const sorted = [...group].sort((a, b) => b.totalMarks - a.totalMarks);
    const rankMap = buildRankMap(sorted);
    rankMap.forEach((rank, resultId) => sectionRankMap.set(resultId, rank));
  });

  // ---- Class-wise ranking (সব section মিলিয়ে) ----
  const byClass = {};
  withTotals.forEach((item) => {
    if (!item.classId) return;
    if (!byClass[item.classId]) byClass[item.classId] = [];
    byClass[item.classId].push(item);
  });

  const classRankMap = new Map();
  Object.values(byClass).forEach((group) => {
    const sorted = [...group].sort((a, b) => b.totalMarks - a.totalMarks);
    const rankMap = buildRankMap(sorted);
    rankMap.forEach((rank, resultId) => classRankMap.set(resultId, rank));
  });

  // ---- সব ExamResult আপডেট করা ----
  const bulkOps = withTotals.map((item) => ({
    updateOne: {
      filter: { _id: item.resultId },
      update: {
        $set: {
          "position.sectionPosition": sectionRankMap.get(item.resultId.toString()) || null,
          "position.classPosition": classRankMap.get(item.resultId.toString()) || null,
        },
      },
    },
  }));

  await ExamResult.bulkWrite(bulkOps);

  return {
    updated: bulkOps.length,
    preview: withTotals.map((item) => ({
      resultId: item.resultId,
      totalMarks: item.totalMarks,
      sectionPosition: sectionRankMap.get(item.resultId.toString()),
      classPosition: classRankMap.get(item.resultId.toString()),
    })),
  };
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
  submitStudentAllSubjects,
  getHighestMarksPerSubject,
    calculatePositions,

}
