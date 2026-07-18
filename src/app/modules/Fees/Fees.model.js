import mongoose, { Schema } from "mongoose";

const FeeItemSchema = new Schema(
  {
    feeHead: {
      type: String,
      required: true,
      trim: true,
    },

    // Receipt Month
    month: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const FeesSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Fee Heads
    feeItems: {
      type: [FeeItemSchema],
      default: [],
    },

    // Receipt Total
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Paid in this receipt
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Remaining due of this receipt
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["paid", "partial", "unpaid"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

FeesSchema.pre("save", function (next) {
  // Calculate receipt total
  this.amount = this.feeItems.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  // Prevent negative values
  this.paidAmount = Math.max(Number(this.paidAmount) || 0, 0);

  // Validation
  if (this.paidAmount > this.amount) {
    return next(
      new Error("Paid amount cannot be greater than total amount.")
    );
  }

  this.dueAmount = this.amount - this.paidAmount;

  if (this.paidAmount === 0) {
    this.status = "unpaid";
  } else if (this.dueAmount === 0) {
    this.status = "paid";
  } else {
    this.status = "partial";
  }

  next();
});

export const Fees =
  mongoose.models.Fees || mongoose.model("Fees", FeesSchema);