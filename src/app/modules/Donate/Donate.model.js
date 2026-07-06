import { Schema, model } from "mongoose";

const DonateSchema = new Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

   donationType: {
  type: String,
  enum: [
    "zakat",
    "sadaqah",
    "lillah",
    "student_sponsorship",
    "hifz_scholarship",
    "hostel_fund",
    "library_fund",
    "general",
    "others",
  ],
  default: "general",
},

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "bkash",
        "nagad",
        "bank",
      ],
      default: "cash",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "cancelled",
      ],
      default: "completed",
    },

    purpose: {
      type: String,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Donate = model("Donate", DonateSchema);