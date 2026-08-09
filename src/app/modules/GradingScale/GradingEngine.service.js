import { GradingScale } from "../GradingScale/GradingScale.model.js";
import { Subject } from "../Subject/Subject.model.js";
import { ClassGroup } from "../ClassGroup/ClassGroup.model.js";

// ১. একটা subject-এর component marks যোগ করে total বের করা
const calculateSubjectTotal = (marksObj, fullMarks) => {
  const {
    written = 0,
    mcq = 0,
    ca = 0,
    practical = 0,
  } = marksObj;

  const total = written + mcq + ca + practical;

  if (total > fullMarks) {
    throw new Error(
      `Obtained marks (${total}) cannot exceed full marks (${fullMarks})`
    );
  }

  return total;
};


// akahne kono validation chilo na ai add korlam 
// const calculateSubjectTotal = (marksObj) => {
//   const { written = 0, mcq = 0, ca = 0, practical = 0 } = marksObj;
//   return written + mcq + ca + practical;
// };
// ২. একটা obtained mark, নির্দিষ্ট GradingScale অনুযায়ী grade/GP বের করা
//    PERCENTAGE হলে fullMark দিয়ে percentage বের করে slab মেলাবে
//    ABSOLUTE হলে সরাসরি obtainedMark দিয়ে slab মেলাবে
const resolveGrade = (obtainedMark, fullMark, scale) => {
  let compareValue;

  if (scale.scaleType === "PERCENTAGE") {
    compareValue = (obtainedMark / fullMark) * 100;
  } else {
    // ABSOLUTE — সরাসরি obtainedMark ব্যবহার হবে (150/200/50 স্কেলে যেটাই হোক)
    compareValue = obtainedMark;
  }

  const slab = scale.slabs.find(
    (s) => compareValue >= s.min && compareValue <= s.max
  );

  return slab
    ? { grade: slab.grade, gradePoint: slab.gradePoint }
    : { grade: "F", gradePoint: 0 };
};

// ৩. একটা subject-এর জন্য পূর্ণ রেজাল্ট বের করা (total, pass/fail, grade, GP)
const calculateSubjectResult = async ({ subjectId, marksObj, isAbsent }) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) throw new Error("Subject not found: " + subjectId);

  if (isAbsent) {
    return {
      subjectId,
      ...marksObj,
      total: 0,
      fullMarks: subject.fullMarks,
      isAbsent: true,
      status: "Absent",
      grade: "F",
      gradePoint: 0,
    };
  }

  // ata ager comment out kore rakhlam for validation 
  // const total = calculateSubjectTotal(marksObj);
const total = calculateSubjectTotal(marksObj, subject.fullMarks);


  const status = total >= subject.passMarks ? "Pass" : "Fail";

  // scale resolve: subject-এর নিজস্ব override না থাকলে classGroup default ব্যবহার হবে
  let scale;
  if (subject.gradingScaleId) {
    scale = await GradingScale.findById(subject.gradingScaleId);
  } else {
    const classDoc = await subject.populate("classId");
    const classGroup = await ClassGroup.findById(
      classDoc.classId.classGroupId
    );
    scale = await GradingScale.findById(classGroup.defaultGradingScaleId);
  }

  // ফেল করলে স্কেল যাই বলুক, জোর করে F/0 বসানো হচ্ছে
  const { grade, gradePoint } =
    status === "Fail"
      ? { grade: "F", gradePoint: 0 }
      : resolveGrade(total, subject.fullMarks, scale);

  return {
    subjectId,
    ...marksObj,
    total,
    fullMarks: subject.fullMarks,
    isAbsent: false,
    status,
    grade,
    gradePoint,
  };
};
const calculateOverallResult = async ({ subjectResults, classGroupId }) => {
  const classGroup = await ClassGroup.findById(classGroupId);

  const mainSubjectResults = [];
  let bonusPoint = 0;

  for (const sr of subjectResults) {
    // absent subject বাদ দিন — GPA গণনায় ধরা যাবে না
    if (sr.isAbsent) continue;

    // subjectId object হতে পারে (populated) — সেখান থেকে raw id বের করা
    const subjectIdValue =
      typeof sr.subjectId === "object" && sr.subjectId !== null
        ? sr.subjectId._id
        : sr.subjectId;

    const subject = await Subject.findById(subjectIdValue);
    if (!subject) continue;

    const gradePoint = Number(sr.gradePoint);
    if (isNaN(gradePoint)) continue; // gradePoint invalid হলে বাদ

    if (subject.subjectType === "4th Subject") {
      const bonus = Math.max(0, gradePoint - 2.0);
      bonusPoint += bonus;
    } else {
      mainSubjectResults.push({ ...sr, gradePoint });
    }
  }

  const anyCompulsoryFail = await hasCompulsoryFail(mainSubjectResults);

  let overallStatus = "Pass";
  if (classGroup.passFailPolicy === "ANY_COMPULSORY_FAIL" && anyCompulsoryFail) {
    overallStatus = "Fail";
  }

  // absent subject থাকলে overallStatus Fail হওয়া উচিত কিনা, সেটাও ভেবে দেখুন
  const anyAbsent = subjectResults.some((sr) => sr.isAbsent);
  if (anyAbsent && classGroup.passFailPolicy === "ANY_COMPULSORY_FAIL") {
    overallStatus = "Fail"; // policy অনুযায়ী adjust করুন
  }

  let gpa = 0;
  if (overallStatus !== "Fail" && mainSubjectResults.length > 0) {
    const baseGpa =
      mainSubjectResults.reduce((sum, s) => sum + s.gradePoint, 0) /
      mainSubjectResults.length;
    const rawGpa = baseGpa + bonusPoint;
    gpa = isNaN(rawGpa) ? 0 : Math.min(5, +rawGpa.toFixed(2));
  }

  return { overallStatus, gpa };
};
// ৪. পুরো exam-এর সব subject মিলিয়ে overall result + GPA বের করা
// const calculateOverallResult = async ({ subjectResults, classGroupId }) => {
//   const classGroup = await ClassGroup.findById(classGroupId);

//   // ৪র্থ/Optional সাবজেক্ট আলাদা করা — মূল গড়ে এরা ধরা হবে না, শুধু বোনাস দেবে
//   const mainSubjectResults = [];
//   let bonusPoint = 0;

//   for (const sr of subjectResults) {
//     const subject = await Subject.findById(sr.subjectId);
//     if (subject.subjectType === "4th Subject") {
//       const bonus = Math.max(0, sr.gradePoint - 2.0);
//       bonusPoint += bonus;
//     } else {
//       mainSubjectResults.push(sr);
//     }
//   }

//   const anyCompulsoryFail = await hasCompulsoryFail(mainSubjectResults);

//   let overallStatus = "Pass";
//   if (classGroup.passFailPolicy === "ANY_COMPULSORY_FAIL" && anyCompulsoryFail) {
//     overallStatus = "Fail";
//   }

//   let gpa = 0;
//   if (overallStatus !== "Fail") {
//     const baseGpa =
//       mainSubjectResults.reduce((sum, s) => sum + s.gradePoint, 0) /
//       mainSubjectResults.length;
//     gpa = Math.min(5, +(baseGpa + bonusPoint).toFixed(2));
//   }

//   return { overallStatus, gpa };
// };
// const calculateOverallResult = async ({ subjectResults, classGroupId }) => {
//   const classGroup = await ClassGroup.findById(classGroupId);

//   const anyCompulsoryFail = await hasCompulsoryFail(subjectResults);

//   let overallStatus = "Pass";
//   if (classGroup.passFailPolicy === "ANY_COMPULSORY_FAIL" && anyCompulsoryFail) {
//     overallStatus = "Fail";
//   }

//   const gpa =
//     overallStatus === "Fail"
//       ? 0
//       : +(
//           subjectResults.reduce((sum, s) => sum + s.gradePoint, 0) /
//           subjectResults.length
//         ).toFixed(2);

//   return { overallStatus, gpa };
// };

const hasCompulsoryFail = async (subjectResults) => {
  for (const sr of subjectResults) {
    if (sr.status === "Fail") {
      const subject = await Subject.findById(sr.subjectId);
      if (subject.subjectType === "Compulsory") return true;
    }
  }
  return false;
};

// ৫. একাধিক term (ExamResult) মিলিয়ে final CGPA — mergeStrategy অনুযায়ী
const calculateFinalResult = ({ termResults, mergeStrategy }) => {
  if (mergeStrategy === "INDEPENDENT") {
    return { cgpa: null }; // প্রতিটা term আলাদাই থাকবে, merge হবে না
  }
  const avg =
    termResults.reduce((sum, t) => sum + t.gpa, 0) / termResults.length;
  return { cgpa: +avg.toFixed(2) };
};

export const GradingEngine = {
  calculateSubjectResult,
  calculateOverallResult,
  calculateFinalResult,
};