import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ["bkash", "nogod", "visa", "bank", "cash", "others"],
      required: true,
    },
    receipt_name: { type: String },
    receipt_number: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Received", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
