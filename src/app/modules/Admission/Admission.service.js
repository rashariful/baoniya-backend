import mongoose from "mongoose";
import { Admission } from "./Admission.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { createStudentWithAcademicRecord } from "../Student/student.utils.js";

// Declare the Services

const createAdmission = async (payload) => {
  const result = await Admission.create(payload);
  return result;
};
const getAllAdmission = async (query) => {
  const AdmissionSearchableFields = ["phone", "fatherName", "studentName"];
  const resultQuery = new QueryBuilder(
    Admission.find().populate("classId"),
    query,
  )
    .search(AdmissionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};
const getSingleAdmission = async (id) => {
  const result = await Admission.findById(id);
  return result;
};
const updateAdmission = async (id, payload) => {
  const result = await Admission.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteAdmission = async (id) => {
  const result = await Admission.findByIdAndDelete(id);
  return result;
};


const approveAdmission = async (id, payload) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Atomic check-and-update, race condition proof
    const admission = await Admission.findOneAndUpdate(
      { _id: id, status: { $ne: "approved" } },
      { status: "approved" },
      { new: false, session }
    );

    if (!admission) {
      throw new Error("Admission not found or already approved");
    }

    const result = await createStudentWithAcademicRecord(
      {
        name: admission.studentName,
        email: admission.email,
        phone: admission.phone,
        fatherName: admission.fatherName,
        motherName: admission.motherName,
        classId: admission.classId,
        sectionId: payload.sectionId,
        sessionId: payload.sessionId,
        roll: payload.roll,
        registrationNo: payload.registrationNo,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


// const approveAdmission = async (id, payload) => {
//   const admission = await Admission.findById(id);

//   if (!admission) {
//     throw new Error("Admission not found");
//   }

//   if (admission.status === "approved") {
//     throw new Error("Admission already approved");
//   }

//   // Student + Academic Record Create
//   const student = await createStudentWithAcademicRecord({
//     name: admission.studentName,
//     fatherName: admission.fatherName,
//     motherName: admission.motherName,
//     phone: admission.phone,
//     address: admission.address,

//     classId: admission.classId,
//     sectionId: payload.sectionId,
//     sessionId: payload.sessionId,
//     roll: payload.roll,
//   });

//   // Update Admission Status
//   admission.status = "approved";
//   await admission.save();

//   return student;
// };

const rejectAdmission = async (id) => {
  const admission = await Admission.findById(id);

  if (!admission) {
    throw new Error("Admission not found");
  }

  admission.status = "rejected";

  await admission.save();

  return admission;
};
export const AdmissionServices = {
  createAdmission,
  getAllAdmission,
  getSingleAdmission,
  updateAdmission,
  deleteAdmission,

  approveAdmission,
  rejectAdmission,
};
