import { Schema, model } from "mongoose";

const TermResultRefSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  term: { type: Number, required: true },
  examResultId: { type: Schema.Types.ObjectId, ref: "ExamResult", required: true },
  gpa: { type: Number, required: true },
}, { _id: false });

const FinalResultSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup", required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: "AcademicSession", required: true },
  termResults: { type: [TermResultRefSchema], required: true },
  mergeStrategy: { type: String, enum: ["AVERAGE", "INDEPENDENT"], required: true }, // snapshot from ClassGroup
  cgpa: { type: Number, default: null },       // AVERAGE হলে ভরবে, INDEPENDENT হলে null থাকবে
  overallStatus: { type: String, enum: ["Pass", "Fail"], default: "Pass" },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

FinalResultSchema.index({ studentId: 1, classGroupId: 1, sessionId: 1 }, { unique: true });

export const FinalResult = model("FinalResult", FinalResultSchema);