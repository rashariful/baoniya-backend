import { Schema, model } from "mongoose";

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    roll: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    classId: { type: Schema.Types.ObjectId, ref: "Classes" },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },
    phone: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true },
);

export const Student = model("Student", StudentSchema);
