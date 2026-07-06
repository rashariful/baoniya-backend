import { Schema, model } from "mongoose";

const ParentsSchema = new Schema(
  {
    fatherName: { type: String },
    motherName: { type: String },
    phone: { type: String },
    address: { type: String },
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
  },
  { timestamps: true },
);

export const Parents = model("Parents", ParentsSchema);
