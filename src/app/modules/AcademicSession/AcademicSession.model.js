import { Schema, model } from "mongoose";

const AcademicSessionSchema = new Schema({
  year: { type: String, required: true, unique: true },
  name: { type: String,},
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const AcademicSession = model("AcademicSession", AcademicSessionSchema);