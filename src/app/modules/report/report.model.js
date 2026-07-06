import { Schema, model } from "mongoose";

const ReportSchema = new Schema(
  {
    title: { type: String },
    type: { type: String },
    data: { type: Object },
  },
  { timestamps: true }
);

export const Report = model("Report", ReportSchema);