import { Schema, model } from "mongoose";

const NoticeSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const Notice = model("Notice", NoticeSchema);