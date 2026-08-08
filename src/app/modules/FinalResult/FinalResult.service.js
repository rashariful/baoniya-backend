import { FinalResult } from "./FinalResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

import { Student } from "../Student/Student.model.js";
import { Classes } from "../Classes/Classes.model.js";
import { ExamResult } from "../ExamResult/ExamResult.model.js";
import { ClassGroup } from "../ClassGroup/ClassGroup.model.js";
import { GradingEngine } from "../GradingScale/GradingEngine.service.js";

// ---------- Helper: safe number check ----------
const isValidNumber = (val) => typeof val === "number" && !isNaN(val) && isFinite(val);

// Single student result generation logic
const generateFinalResult = async ({ studentId, classGroupId, sessionId }) => {
  if (!studentId || !classGroupId || !sessionId) {
    throw new Error("studentId, classGroupId এবং sessionId — তিনটাই আবশ্যক");
  }

  const classGroup = await ClassGroup.findById(classGroupId);
  if (!classGroup) {
    throw new Error(`ClassGroup পাওয়া যায়নি: ${classGroupId}`);
  }

  const examResults = await ExamResult.find({ studentId, sessionId }).populate({
    path: "examId",
    match: { classGroupId },
  });

  // classGroup match করেনি এমন গুলো বাদ (populate match না মিললে examId null হয়)
  const validResults = examResults.filter((r) => r.examId);

  if (validResults.length === 0) {
    throw new Error(
      `এই student (${studentId}) এর এই classGroup/session-এর কোনো valid exam result পাওয়া যায়নি`
    );
  }

  // gpa ফিল্ড valid number কিনা চেক করে termResults বানানো — invalid gpa থাকলে বাদ দিয়ে warning log
  const termResults = [];
  const skippedExams = [];

  for (const r of validResults) {
    const gpa = Number(r.gpa);
    if (!isValidNumber(gpa)) {
      skippedExams.push({ examResultId: r._id, examId: r.examId?._id, rawGpa: r.gpa });
      continue; // invalid gpa হলে termResults-এ ঢুকাবো না
    }
    termResults.push({
      examId: r.examId._id,
      term: r.examId.term,
      examResultId: r._id,
      gpa,
    });
  }

  if (skippedExams.length > 0) {
    console.warn(
      `[generateFinalResult] Invalid/NaN gpa পাওয়া গেছে, বাদ দেওয়া হলো — studentId: ${studentId}`,
      skippedExams
    );
  }

  if (termResults.length === 0) {
    throw new Error(
      `এই student (${studentId}) এর কোনো exam-এর valid GPA নেই — CGPA calculate করা যাচ্ছে না`
    );
  }

  const engineResult = GradingEngine.calculateFinalResult({
    termResults,
    mergeStrategy: classGroup.mergeStrategy,
  });

  const rawCgpa = Number(engineResult?.cgpa);

  if (!isValidNumber(rawCgpa)) {
    // এখানেই আসল guard — NaN কখনোই DB পর্যন্ত পৌঁছাতে দেওয়া হবে না
    throw new Error(
      `CGPA calculation থেকে invalid ভ্যালু পাওয়া গেছে (studentId: ${studentId}). ` +
        `GradingEngine.calculateFinalResult চেক করুন — mergeStrategy: "${classGroup.mergeStrategy}"`
    );
  }

  const cgpa = +rawCgpa.toFixed(2);

  const overallStatus = validResults.some((r) => r.overallStatus === "Fail")
    ? "Fail"
    : "Pass";

  const finalResult = await FinalResult.findOneAndUpdate(
    { studentId, classGroupId, sessionId },
    {
      studentId,
      classGroupId,
      sessionId,
      termResults,
      mergeStrategy: classGroup.mergeStrategy,
      cgpa,
      overallStatus,
    },
    { upsert: true, new: true, runValidators: true }
  );

  return finalResult;
};

// Bulk generation logic — একজনের error-এ বাকিরা যাতে আটকে না যায়
const generateBulkFinalResult = async (payload) => {
  const { classGroupId, classId, sectionId, sessionId } = payload;

  if (!sessionId) {
    throw new Error("sessionId আবশ্যক");
  }

  let studentFilter = { sessionId };

  if (classId) {
    studentFilter.classId = classId;
    if (sectionId) studentFilter.sectionId = sectionId;
  } else if (classGroupId) {
    const classesInGroup = await Classes.find({ classGroupId }).select("_id");
    const classIds = classesInGroup.map((c) => c._id);

    if (classIds.length === 0) {
      throw new Error("এই classGroupId-এর অধীনে কোনো Class পাওয়া যায়নি");
    }
    studentFilter.classId = { $in: classIds };
  } else {
    throw new Error("classId অথবা classGroupId — কোনো একটা দিতে হবে");
  }

  const students = await Student.find(studentFilter);

  if (!students || students.length === 0) {
    throw new Error("No students found for this class/session.");
  }

  const results = [];
  const failed = [];

  for (const student of students) {
    try {
      let resolvedClassGroupId = classGroupId;
      if (!resolvedClassGroupId) {
        const cls = await Classes.findById(student.classId);
        resolvedClassGroupId = cls?.classGroupId;
      }

      if (!resolvedClassGroupId) {
        throw new Error(`classGroupId resolve করা যায়নি (studentId: ${student._id})`);
      }

      const singleResult = await generateFinalResult({
        studentId: student._id,
        classGroupId: resolvedClassGroupId,
        sessionId,
      });
      results.push(singleResult);
    } catch (err) {
      // একজনের ভুল ডেটার কারণে পুরো bulk operation যাতে না থামে
      console.error(`[generateBulkFinalResult] Failed for student ${student._id}:`, err.message);
      failed.push({
        studentId: student._id,
        studentName: student.name,
        reason: err.message,
      });
    }
  }

  return {
    count: results.length,
    results,
    failedCount: failed.length,
    failed, // frontend-এ দেখানো যাবে কোন কোন student-এর result generate হয়নি এবং কেন
  };
};

const createFinalResult = async (payload) => {
  const result = await FinalResult.create(payload);
  return result;
};

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
        populate: { path: "subjects.subjectId", select: "name code fullMarks passMarks" },
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
      populate: { path: "subjects.subjectId", select: "name code fullMarks passMarks" },
    });
  return result;
};

const updateFinalResult = async (id, payload) => {
  const result = await FinalResult.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFinalResult = async (id) => {
  const result = await FinalResult.findByIdAndDelete(id);
  return result;
};

export const FinalResultServices = {
  createFinalResult,
  getAllFinalResult,
  getSingleFinalResult,
  updateFinalResult,
  deleteFinalResult,
  generateFinalResult,
  generateBulkFinalResult,
};


// import { FinalResult } from "./FinalResult.model.js";
// import QueryBuilder from "../../helpers/QueryBuilder.js";

// import { Student } from "../Student/Student.model.js";
// import { Classes } from "../Classes/Classes.model.js";
// import { ExamResult } from "../ExamResult/ExamResult.model.js";
// import { ClassGroup } from "../ClassGroup/ClassGroup.model.js";
// import { GradingEngine } from "../GradingScale/GradingEngine.service.js";

// // Single student result generation logic (যা আপনার কাছে আগে থেকেই ছিল)
// const generateFinalResult = async ({ studentId, classGroupId, sessionId }) => {
//   const classGroup = await ClassGroup.findById(classGroupId);

//   const examResults = await ExamResult.find({ studentId, sessionId })
//     .populate({ path: "examId", match: { classGroupId } });

//   const validResults = examResults.filter((r) => r.examId);

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


// const generateBulkFinalResult = async (payload) => {
//   const { classGroupId, classId, sectionId, sessionId } = payload;

//   let studentFilter = { sessionId };

//   if (classId) {
//     // frontend থেকে নির্দিষ্ট class/section এসেছে — সরাসরি সেটা দিয়ে ফিল্টার
//     studentFilter.classId = classId;
//     if (sectionId) studentFilter.sectionId = sectionId;
//   } else if (classGroupId) {
//     // classId না এলে, ClassGroup থেকে সব Classes বের করে সেগুলো দিয়ে ফিল্টার
//     const classesInGroup = await Classes.find({ classGroupId }).select("_id");
//     const classIds = classesInGroup.map((c) => c._id);
//     studentFilter.classId = { $in: classIds };
//   } else {
//     throw new Error("classId অথবা classGroupId — কোনো একটা দিতে হবে");
//   }

//   const students = await Student.find(studentFilter);

//   if (!students || students.length === 0) {
//     throw new Error("No students found for this class/session.");
//   }

//   const results = [];
//   for (const student of students) {
//     // প্রতিটা স্টুডেন্টের নিজের classGroupId দরকার হবে GradingEngine-এর জন্য —
//     // classGroupId payload-এ না থাকলে student.classId → Classes থেকে বের করতে হবে
//     let resolvedClassGroupId = classGroupId;
//     if (!resolvedClassGroupId) {
//       const cls = await Classes.findById(student.classId);
//       resolvedClassGroupId = cls?.classGroupId;
//     }

//     const singleResult = await generateFinalResult({
//       studentId: student._id,
//       classGroupId: resolvedClassGroupId,
//       sessionId,
//     });
//     results.push(singleResult);
//   }

//   return { count: results.length, results };
// };

// // Bulk generation logic (যা সার্ভিস থেকে কল হবে)
// // const generateBulkFinalResult = async (payload) => {
// //   const { classGroupId, sessionId } = payload;

// //   // ঐ ক্লাস এবং সেশনের সব স্টুডেন্ট খুঁজে বের করা
// //   const students = await Student.find({ classGroupId, sessionId });

// //   if (!students || students.length === 0) {
// //     throw new Error("No students found for this class group and session.");
// //   }

// //   const results = [];

// //   // লুপ চালিয়ে একেকটি স্টুডেন্টের জন্য সিঙ্গেল ফাংশনটিই কল করা হচ্ছে
// //   for (const student of students) {
// //     const singleResult = await generateFinalResult({
// //       studentId: student._id,
// //       classGroupId,
// //       sessionId,
// //     });
// //     results.push(singleResult);
// //   }

// //   return {
// //     count: results.length,
// //     results,
// //   };
// // };


// // const generateFinalResult = async ({ studentId, classGroupId, sessionId }) => {
// //   const classGroup = await ClassGroup.findById(classGroupId);

// //   // এই student, এই classGroup-এর exam গুলো খুঁজে বের করা
// //   const examResults = await ExamResult.find({ studentId, sessionId })
// //     .populate({ path: "examId", match: { classGroupId } });

// //   const validResults = examResults.filter((r) => r.examId); // classGroup match করা গুলো রাখা

// //   const termResults = validResults.map((r) => ({
// //     examId: r.examId._id,
// //     term: r.examId.term,
// //     examResultId: r._id,
// //     gpa: r.gpa,
// //   }));

// //   const { cgpa } = GradingEngine.calculateFinalResult({
// //     termResults,
// //     mergeStrategy: classGroup.mergeStrategy,
// //   });

// //   const overallStatus = validResults.some((r) => r.overallStatus === "Fail")
// //     ? "Fail"
// //     : "Pass";

// //   const finalResult = await FinalResult.findOneAndUpdate(
// //     { studentId, classGroupId, sessionId },
// //     {
// //       studentId, classGroupId, sessionId,
// //       termResults,
// //       mergeStrategy: classGroup.mergeStrategy,
// //       cgpa,
// //       overallStatus,
// //     },
// //     { upsert: true, new: true }
// //   );

// //   return finalResult;
// // };

// const createFinalResult = async (payload) => {
//     const result = await FinalResult.create(payload);
//     return result;
// }

// const getAllFinalResult = async (query) => {
//     const FinalResultSearchableFields = [];
//     const resultQuery = new QueryBuilder(
//         FinalResult.find()
//             .populate("studentId", "name studentId")
//             .populate("classGroupId", "name")
//             .populate("sessionId", "name")
//             .populate("termResults.examId", "name term")
//             .populate({
//                 path: "termResults.examResultId",
//                 select: "subjects overallStatus gpa",
//                 populate: { path: "subjects.subjectId", select: "name code fullMarks passMarks" }
//             }),
//         query
//     )
//         .search(FinalResultSearchableFields)
//         .filter()
//         .sort()
//         .fields()
//         .paginate()
//         .limit();

//     const result = await resultQuery.modelQuery;
//     const meta = await resultQuery.countTotal();

//     return { data: result, meta };
// };

// const getSingleFinalResult = async (id) => {
//     const result = await FinalResult.findById(id)
//         .populate("studentId", "name studentId")
//         .populate("classGroupId", "name")
//         .populate("sessionId", "name")
//         .populate("termResults.examId", "name term")
//    .populate({
//   path: "termResults.examResultId",
//   select: "subjects overallStatus gpa",
//   populate: { path: "subjects.subjectId", select: "name code fullMarks passMarks" }
// })
//     return result;
// };

// const updateFinalResult = async (id, payload) => {
//     const result = await FinalResult.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
//     return result;
// }
// const deleteFinalResult = async (id) => {
//     const result = await FinalResult.findByIdAndDelete(id);
//     return result;
// }


// export const FinalResultServices = {
//     createFinalResult,
//     getAllFinalResult,
//     getSingleFinalResult,
//     updateFinalResult,
//     deleteFinalResult,
//     generateFinalResult,
//   generateBulkFinalResult,
// }
