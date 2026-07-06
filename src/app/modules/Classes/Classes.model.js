import { Schema, model } from "mongoose";

const ClassesSchema = new Schema(
  {
    name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
    // section: { type: String },
    // teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
 
export const Classes = model("Classes", ClassesSchema);
// import { Schema, model } from "mongoose";

// const ClassesSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     section: { type: String },
//     teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export const Classes = model("Classes", ClassesSchema);
