import { Schema, model } from "mongoose";

const ExaminationSchema = new Schema(
  {
    title: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Classes" },
    date: { type: Date },
    totalMarks: { type: Number },
  },
  { timestamps: true }
);

export const Examination = model("Examination", ExaminationSchema);