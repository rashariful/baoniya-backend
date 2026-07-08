import { Schema, model } from "mongoose";

const EducationSchema = new Schema(
  {
    label: { type: String, required: true },
    institute: { type: String, required: true },
    year: { type: Number, required: true },
    grade: { type: String },
  },
  { _id: false }
);

const EmergencyContactSchema = new Schema(
  {
    name: { type: String },
    relation: { type: String },
    phone: { type: String },
  },
  { _id: false }
);

const SocialSchema = new Schema(
  {
    facebook: String,
    linkedin: String,
    instagram: String,
    twitter: String,
  },
  { _id: false }
);

const TeacherSchema = new Schema(
  {
    // 🔥 NEW: User model er sathe link
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    thumbnail: { type: String, default: "" },

    name: { type: String, required: true, trim: true },

    teacherId: {
      type: String,
      unique: true,
      required: true, // 🔥 required kore dilam, auto-generate hobe
    },

    nid: { type: String, unique: true, sparse: true },
    birthCertificateNo: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    religion: { type: String },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    // Professional Information
    designation: { type: String, required: true },
    department: { type: String },
    subject: { type: String },
    qualification: { type: String },
    teachingExperience: { type: Number, default: 0 },
    salary: { type: Number, default: 0 },
    joinDate: { type: Date },
    schoolJoinDate: { type: Date },
    bio: { type: String },

    // 🔥 NEW: primary phone (User model e eta e jabe login credential hisebe)
    phone: {
      type: String,
      required: true,
    },

    alternativePhone: { type: String },

    presentAddress: { type: String },
    permanentAddress: { type: String },

    emergencyContact: EmergencyContactSchema,
    social: SocialSchema,
    education: [EducationSchema],

    bankName: String,
    accountName: String,
    accountNumber: String,
    branchName: String,
    routingNumber: String,

    employmentType: {
      type: String,
      enum: ["Permanent", "Contract", "Part Time"],
      default: "Permanent",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Resigned"],
      default: "Active",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Teacher = model("Teacher", TeacherSchema);

// import { Schema, model } from "mongoose";

// const EducationSchema = new Schema(
//   {
//     label: { type: String, required: true }, // SSC / HSC / Honours
//     institute: { type: String, required: true },
//     year: { type: Number, required: true },
//     grade: { type: String },
//   },
//   { _id: false },
// );

// const EmergencyContactSchema = new Schema(
//   {
//     name: { type: String },
//     relation: { type: String },
//     phone: { type: String },
//   },
//   { _id: false },
// );

// const SocialSchema = new Schema(
//   {
//     facebook: String,
//     linkedin: String,
//     instagram: String,
//     twitter: String,
//   },
//   { _id: false },
// );

// const TeacherSchema = new Schema(
//   {
//     // Basic Information
//     thumbnail: {
//       type: String,
//       default: "",
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     teacherId: {
//       type: String,
//       unique: true,
//     },

//     nid: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },

//     birthCertificateNo: {
//       type: String,
//     },

//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other"],
//     },

//     dateOfBirth: {
//       type: Date,
//     },

//     bloodGroup: {
//       type: String,
//       enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
//     },

//     religion: {
//       type: String,
//     },

//     maritalStatus: {
//       type: String,
//       enum: ["Single", "Married", "Divorced", "Widowed"],
//     },

//     // Professional Information
//     designation: {
//       type: String,
//       required: true,
//     },

//     department: {
//       type: String,
//     },

//     subject: {
//       type: String,
//     },

//     qualification: {
//       type: String,
//     },

//     teachingExperience: {
//       type: Number,
//       default: 0,
//     },

//     salary: {
//       type: Number,
//       default: 0,
//     },

//     joinDate: {
//       type: Date,
//     },

//     schoolJoinDate: {
//       type: Date,
//     },

//     bio: {
//       type: String,
//     },

//     alternativePhone: {
//       type: String,
//     },

  

//     presentAddress: {
//       type: String,
//     },

//     permanentAddress: {
//       type: String,
//     },

//     emergencyContact: EmergencyContactSchema,

//     social: SocialSchema,

//     // Education
//     education: [EducationSchema],

//     // Bank Information
//     bankName: String,
//     accountName: String,
//     accountNumber: String,
//     branchName: String,
//     routingNumber: String,

//     // Employment Status
//     employmentType: {
//       type: String,
//       enum: ["Permanent", "Contract", "Part Time"],
//       default: "Permanent",
//     },

//     status: {
//       type: String,
//       enum: ["Active", "Inactive", "Resigned"],
//       default: "Active",
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Teacher = model("Teacher", TeacherSchema);
