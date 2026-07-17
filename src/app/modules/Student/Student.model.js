import { Schema, model } from "mongoose";

const StudentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    thumbnail: { type: String },
    name: { type: String, required: true },
    roll: { type: String },
    registrationNo: { type: String, default: null, index: true },

    dob: { type: String },
    bloodGroup: { type: String },
    fatherName: { type: String },
    motherName: { type: String },

    // ✅ NEW - guardian contact info
    guardianName: { type: String },
    guardianPhone: {
      type: String,
      required: true,
      trim: true,
      index: true, // notification query e filter/lookup fast korbe
    },
    // phone: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   index: true, // notification query e filter/lookup fast korbe
    // },

    classId: { type: Schema.Types.ObjectId, ref: "Classes" },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    address: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "transferred", "graduated"],
      default: "active",
    }, // ⚠️ tomar schema te status field chilo na, broadcast e "active" filter korte hole eita lagbe - na thakle janio
  },
  { timestamps: true }
);

export const Student = model("Student", StudentSchema);

