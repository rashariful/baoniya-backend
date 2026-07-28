import { Schema, model } from "mongoose";

const SlabSchema = new Schema({
  grade: { type: String, required: true },   // "A+", "A", "A-", "B", "C", "D", "F"
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  gradePoint: { type: Number, required: true },
}, { _id: false });

const GradingScaleSchema = new Schema({
  name: { type: String, required: true, unique: true }, // "Standard-100", "Bangla-English-6to8"
  scaleType: {
    type: String,
    enum: ["PERCENTAGE", "ABSOLUTE"],
    required: true,
  },
  totalMarkForAbsolute: { type: Number }, // শুধু scaleType = ABSOLUTE হলে দরকার
  slabs: { type: [SlabSchema], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const GradingScale = model("GradingScale", GradingScaleSchema);