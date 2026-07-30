
import { FinalResult } from "./FinalResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

import { Student } from "../Student/Student.model.js";
import { Classes } from "../Classes/Classes.model.js";
import { ExamResult } from "../ExamResult/ExamResult.model.js";
import { ClassGroup } from "../ClassGroup/ClassGroup.model.js";
import { GradingEngine } from "../GradingScale/GradingEngine.service.js";

// Single student result generation logic (যা আপনার কাছে আগে থেকেই ছিল)
const generateFinalResult = async ({ studentId, classGroupId, sessionId }) => {
  const classGroup = await ClassGroup.findById(classGroupId);

  const examResults = await ExamResult.find({ studentId, sessionId })
    .populate({ path: "examId", match: { classGroupId } });

  const validResults = examResults.filter((r) => r.examId);

  const termResults = validResults.map((r) => ({
    examId: r.examId._id,
    term: r.examId.term,
    examResultId: r._id,
    gpa: r.gpa,
  }));

  const { cgpa } = GradingEngine.calculateFinalResult({
    termResults,
    mergeStrategy: classGroup.mergeStrategy,
  });

  const overallStatus = validResults.some((r) => r.overallStatus === "Fail")
    ? "Fail"
    : "Pass";

  const finalResult = await FinalResult.findOneAndUpdate(
    { studentId, classGroupId, sessionId },
    {
      studentId, classGroupId, sessionId,
      termResults,
      mergeStrategy: classGroup.mergeStrategy,
      cgpa,
      overallStatus,
    },
    { upsert: true, new: true }
  );

  return finalResult;
};


const generateBulkFinalResult = async (payload) => {
  const { classGroupId, classId, sectionId, sessionId } = payload;

  let studentFilter = { sessionId };

  if (classId) {
    // frontend থেকে নির্দিষ্ট class/section এসেছে — সরাসরি সেটা দিয়ে ফিল্টার
    studentFilter.classId = classId;
    if (sectionId) studentFilter.sectionId = sectionId;
  } else if (classGroupId) {
    // classId না এলে, ClassGroup থেকে সব Classes বের করে সেগুলো দিয়ে ফিল্টার
    const classesInGroup = await Classes.find({ classGroupId }).select("_id");
    const classIds = classesInGroup.map((c) => c._id);
    studentFilter.classId = { $in: classIds };
  } else {
    throw new Error("classId অথবা classGroupId — কোনো একটা দিতে হবে");
  }

  const students = await Student.find(studentFilter);

  if (!students || students.length === 0) {
    throw new Error("No students found for this class/session.");
  }

  const results = [];
  for (const student of students) {
    // প্রতিটা স্টুডেন্টের নিজের classGroupId দরকার হবে GradingEngine-এর জন্য —
    // classGroupId payload-এ না থাকলে student.classId → Classes থেকে বের করতে হবে
    let resolvedClassGroupId = classGroupId;
    if (!resolvedClassGroupId) {
      const cls = await Classes.findById(student.classId);
      resolvedClassGroupId = cls?.classGroupId;
    }

    const singleResult = await generateFinalResult({
      studentId: student._id,
      classGroupId: resolvedClassGroupId,
      sessionId,
    });
    results.push(singleResult);
  }

  return { count: results.length, results };
};

// Bulk generation logic (যা সার্ভিস থেকে কল হবে)
// const generateBulkFinalResult = async (payload) => {
//   const { classGroupId, sessionId } = payload;

//   // ঐ ক্লাস এবং সেশনের সব স্টুডেন্ট খুঁজে বের করা
//   const students = await Student.find({ classGroupId, sessionId });

//   if (!students || students.length === 0) {
//     throw new Error("No students found for this class group and session.");
//   }

//   const results = [];

//   // লুপ চালিয়ে একেকটি স্টুডেন্টের জন্য সিঙ্গেল ফাংশনটিই কল করা হচ্ছে
//   for (const student of students) {
//     const singleResult = await generateFinalResult({
//       studentId: student._id,
//       classGroupId,
//       sessionId,
//     });
//     results.push(singleResult);
//   }

//   return {
//     count: results.length,
//     results,
//   };
// };


// const generateFinalResult = async ({ studentId, classGroupId, sessionId }) => {
//   const classGroup = await ClassGroup.findById(classGroupId);

//   // এই student, এই classGroup-এর exam গুলো খুঁজে বের করা
//   const examResults = await ExamResult.find({ studentId, sessionId })
//     .populate({ path: "examId", match: { classGroupId } });

//   const validResults = examResults.filter((r) => r.examId); // classGroup match করা গুলো রাখা

//   const termResults = validResults.map((r) => ({
//     examId: r.examId._id,
//     term: r.examId.term,
//     examResultId: r._id,
//     gpa: r.gpa,
//   }));

//   const { cgpa } = GradingEngine.calculateFinalResult({
//     termResults,
//     mergeStrategy: classGroup.mergeStrategy,
//   });

//   const overallStatus = validResults.some((r) => r.overallStatus === "Fail")
//     ? "Fail"
//     : "Pass";

//   const finalResult = await FinalResult.findOneAndUpdate(
//     { studentId, classGroupId, sessionId },
//     {
//       studentId, classGroupId, sessionId,
//       termResults,
//       mergeStrategy: classGroup.mergeStrategy,
//       cgpa,
//       overallStatus,
//     },
//     { upsert: true, new: true }
//   );

//   return finalResult;
// };

const createFinalResult = async (payload) => {
    const result = await FinalResult.create(payload);
    return result;
}

const getAllFinalResult = async (query) => {
    const FinalResultSearchableFields = [];
    const resultQuery = new QueryBuilder(
        FinalResult.find()
            .populate("studentId", "name studentId")
            .populate("classGroupId", "name")
            .populate("sessionId", "name")
            .populate("termResults.examId", "name term")
            .populate({
                path: "termResults.examResultId",
                select: "subjects overallStatus gpa",
                populate: { path: "subjects.subjectId", select: "name code fullMarks passMarks" }
            }),
        query
    )
        .search(FinalResultSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
        .limit();

    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return { data: result, meta };
};

const getSingleFinalResult = async (id) => {
    const result = await FinalResult.findById(id)
        .populate("studentId", "name studentId")
        .populate("classGroupId", "name")
        .populate("sessionId", "name")
        .populate("termResults.examId", "name term")
   .populate({
  path: "termResults.examResultId",
  select: "subjects overallStatus gpa",
  populate: { path: "subjects.subjectId", select: "name code fullMarks passMarks" }
})
    return result;
};

const updateFinalResult = async (id, payload) => {
    const result = await FinalResult.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteFinalResult = async (id) => {
    const result = await FinalResult.findByIdAndDelete(id);
    return result;
}


export const FinalResultServices = {
    createFinalResult,
    getAllFinalResult,
    getSingleFinalResult,
    updateFinalResult,
    deleteFinalResult,
    generateFinalResult,
  generateBulkFinalResult,
}
