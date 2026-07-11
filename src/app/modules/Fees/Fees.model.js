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
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
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

// auto-calculate dueAmount + status before save (create & save())
FeesSchema.pre("save", function (next) {
  const amount = Number(this.amount) || 0;
  const paidAmount = Number(this.paidAmount) || 0;

  this.dueAmount = Math.max(amount - paidAmount, 0);

  if (this.dueAmount === 0 && paidAmount > 0) {
    this.status = "paid";
  } else if (paidAmount > 0 && this.dueAmount > 0) {
    this.status = "partial";
  } else {
    this.status = "unpaid";
  }

  next();
});

export const Fees =
  mongoose.models.Fees || mongoose.model("Fees", FeesSchema);