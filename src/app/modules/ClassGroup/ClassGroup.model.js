import { Schema, model } from "mongoose";

const ClassGroupSchema = new Schema({
  name: { type: String, required: true, unique: true }, // "Nursery-5", "6-8", "9", "10"
  totalTerms: { type: Number, required: true },          // 3 for Nursery-5, 2 for 6-8/9/10
  mergeStrategy: {
    type: String,
    enum: ["AVERAGE", "INDEPENDENT"],
    default: "AVERAGE",
  },
  passFailPolicy: {
    type: String,
    enum: ["ANY_COMPULSORY_FAIL", "AVERAGE_ONLY"],
    default: "ANY_COMPULSORY_FAIL",
  },
  defaultGradingScaleId: { type: Schema.Types.ObjectId, ref: "GradingScale" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ClassGroup = model("ClassGroup", ClassGroupSchema);