import { Schema, model } from "mongoose";

const AdmissionSchema = new Schema(
  {
    studentName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String },
    phone: { type: String, required: true },
    email: { type: String },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    roll: { type: String },

    address: { type: String },
    dob: { type: Date },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Admission = model("Admission", AdmissionSchema);
