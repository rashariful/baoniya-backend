import { Schema, model } from "mongoose";

const StudentAcademicRecordSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },

    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    roll: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "studying",
        "promoted",
        "failed",
        "graduated",
        "tc",
      ],
      default: "studying",
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    remarks: String,
  },
  {
    timestamps: true,
  }
);

StudentAcademicRecordSchema.index(
  {
    studentId: 1,
    sessionId: 1,
  },
  {
    unique: true,
  }
);

export const StudentAcademicRecord = model(
  "StudentAcademicRecord",
  StudentAcademicRecordSchema
);