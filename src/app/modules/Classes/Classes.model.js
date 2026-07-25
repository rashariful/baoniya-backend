import { Schema, model } from "mongoose";

const ClassesSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup", required: true }, // ← নতুন
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Classes = model("Classes", ClassesSchema);
