import { Schema, model } from "mongoose";

const ExamResultSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', index: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', index: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'AcademicSession' },
  
  subjects: [{
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    written: Number,
    mcq: Number,
    practical: Number,
    total: Number,
    fullMarks: Number, // Snapshot
    isAbsent: { type: Boolean, default: false },
    status: { type: String, enum: ['Pass', 'Fail', 'Absent'], default: 'Pass' },
    grade: String,
    gradePoint: Number
  }],
  
  position: {
    classPosition: Number,
    sectionPosition: Number
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  lastModifiedBy: { type: Schema.Types.ObjectId },
  resultLockedAt: Date
}, { timestamps: true });

// Compound index for fast lookup
ExamResultSchema.index({ studentId: 1, examId: 1, sessionId: 1 });

export const ExamResult = model("ExamResult", ExamResultSchema);