import { Schema, model } from "mongoose";

const StaffSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    salary: { type: Number, default: 0 },

    joinDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Staff = model("Staff", StaffSchema);