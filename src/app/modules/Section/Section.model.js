import { Schema, model } from "mongoose";
const SectionSchema = new Schema({
  name: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Classes', required: true },
}, { timestamps: true });

export const Section = model("Section", SectionSchema);