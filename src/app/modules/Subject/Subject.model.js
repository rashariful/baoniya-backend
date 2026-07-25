import { Schema, model } from "mongoose";

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Classes', required: true },
  fullMarks: { type: Number, required: true },
  passMarks: { type: Number, required: true },
  subjectType: { type: String, enum: ['Compulsory', 'Optional', '4th Subject'], default: 'Compulsory' },
  gradingScaleId: { type: Schema.Types.ObjectId, ref: 'GradingScale' }, // ← নতুন, না দিলে ClassGroup.defaultGradingScaleId ব্যবহার হবে
}, { timestamps: true });

export const Subject = model("Subject", SubjectSchema);