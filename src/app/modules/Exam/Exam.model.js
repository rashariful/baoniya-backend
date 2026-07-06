import { Schema, model } from "mongoose";

const ExamSchema = new Schema({
  name: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Published', 'Locked'], default: 'Upcoming' },
}, { timestamps: true });

export const Exam = model("Exam", ExamSchema);