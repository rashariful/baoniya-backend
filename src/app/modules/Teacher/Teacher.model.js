import { Schema, model } from "mongoose";

const TeacherSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String },
    phone: { type: String },
    salary: { type: Number },
  },
  { timestamps: true }
);

export const Teacher = model("Teacher", TeacherSchema);