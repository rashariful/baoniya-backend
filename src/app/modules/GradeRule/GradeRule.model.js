import { Schema, model } from "mongoose";
const GradeRuleSchema = new Schema({
  boardType: { type: String, required: true }, // e.g., "NCTB", "Madrasha"
  sessionId: { type: Schema.Types.ObjectId, ref: 'AcademicSession' },
  rules: [{
    grade: String,
    minMark: Number,
    maxMark: Number,
    gradePoint: Number
  }],
  applicableClasses: [{ type: Schema.Types.ObjectId, ref: 'Classes' }]
}, { timestamps: true });

export const GradeRule = model("GradeRule", GradeRuleSchema);