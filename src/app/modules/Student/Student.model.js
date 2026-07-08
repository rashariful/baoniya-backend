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

    name: { type: String, required: true },
   

    roll: { type: String },
    registrationNo: { type: String, default: null, index: true },

    fatherName: { type: String },
    motherName: { type: String },

    classId: { type: Schema.Types.ObjectId, ref: "Classes" },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    address: { type: String },
  },
  { timestamps: true }
);

export const Student = model("Student", StudentSchema);

// import { Schema, model } from "mongoose";

// const StudentSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     roll: { type: String },
//     fatherName: { type: String },
//     motherName: { type: String },
//     classId: { type: Schema.Types.ObjectId, ref: "Classes" },
//     sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
//     sessionId: {
//       type: Schema.Types.ObjectId,
//       ref: "AcademicSession",
//       required: true,
//     },
//     phone: { type: String, required: true },
//     address: { type: String },
//   },
//   { timestamps: true },
// );

// export const Student = model("Student", StudentSchema);
