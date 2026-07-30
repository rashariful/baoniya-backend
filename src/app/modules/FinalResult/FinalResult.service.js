
import { FinalResult } from "./FinalResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

import { ExamResult } from "../ExamResult/ExamResult.model.js";
import { ClassGroup } from "../ClassGroup/ClassGroup.model.js";
import { GradingEngine } from "../GradingScale/GradingEngine.service.js";

const generateFinalResult = async ({ studentId, classGroupId, sessionId }) => {
  const classGroup = await ClassGroup.findById(classGroupId);

  // এই student, এই classGroup-এর exam গুলো খুঁজে বের করা
  const examResults = await ExamResult.find({ studentId, sessionId })
    .populate({ path: "examId", match: { classGroupId } });

  const validResults = examResults.filter((r) => r.examId); // classGroup match করা গুলো রাখা

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




const createFinalResult = async (payload) => {
    const result = await FinalResult.create(payload);
    return result;
}
// const getAllFinalResult = async (query) => {
//     const FinalResultSearchableFields = [];
//     const resultQuery = new QueryBuilder(
//         FinalResult.find()
//             .populate("studentId", "name studentId rollNumber")
//             .populate("classGroupId", "name")
//             .populate("sessionId", "name"),
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

//     return {
//         data: result,
//         meta
//     }
// }
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




// const getAllFinalResult = async (query) => {
//     const FinalResultSearchableFields = [];
//     const resultQuery = new QueryBuilder(FinalResult.find(), query).search(FinalResultSearchableFields).filter().sort().fields().paginate().limit();
//     const result = await resultQuery.modelQuery;
//     const meta = await resultQuery.countTotal();

//     return {
//         data: result,
//         meta
//     }
// }
// const getSingleFinalResult = async (id) => {
//     const result = await FinalResult.findById(id);
//     return result;
// }
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
    generateFinalResult
}
