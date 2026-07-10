import mongoose, { Schema } from "mongoose";

const FeesSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
    },
    month: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export const Fees =
  mongoose.models.Fees || mongoose.model("Fees", FeesSchema);