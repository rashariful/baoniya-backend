import { Schema, model } from "mongoose";
const ResultSettingSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "AcademicSession" },
    classId: { type: Schema.Types.ObjectId, ref: "Classes" },
    examId: { type: Schema.Types.ObjectId, ref: "Exam" },
    subjectCombination: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    attendanceRequired: { type: Boolean, default: false },
    minAttendancePercent: { type: Number, default: 0 },
    isResultPublishAllowed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ResultSetting = model("ResultSetting", ResultSettingSchema);
