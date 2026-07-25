import { Schema, model } from "mongoose";

const ExamSchema = new Schema({
  name: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
  classGroupId: { type: Schema.Types.ObjectId, ref: 'ClassGroup', required: true }, // ← নতুন
  term: { type: Number, required: true },   // 1, 2, or 3 (কততম সেমিস্টার/পরীক্ষা)
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Published', 'Locked'], default: 'Upcoming' },
}, { timestamps: true });

export const Exam = model("Exam", ExamSchema);