
import { Teacher } from "./Teacher.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { createTeacherWithCredentials } from "../../utils/teacher.utils.js";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.js";

// Declare the Services 

const createTeacher = async (file, payload) => {

  try {
    if (file?.buffer) {
    
      const imageName = `teacher-${Date.now()}`;

      const uploadResult = await sendImageToCloudinary(
        imageName,
        file.buffer
      );

      payload.thumbnail = uploadResult.secure_url;

    
    }

    const result = await createTeacherWithCredentials(payload);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// const createTeacher = async (payload) => {
//     const result = await Teacher.create(payload);
//     return result;
// }
const getAllTeacher = async (query) => {
    const TeacherSearchableFields = ["name", "phone"];
    const resultQuery = new QueryBuilder(Teacher.find(), query).search(TeacherSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleTeacher = async (id) => {
    const result = await Teacher.findById(id);
    return result;
}
const updateTeacher = async (id, file, payload) => {
  try {
    // FormData theke ashle ei fields gula JSON string hishebe thake — parse kore real object/array banate hobe
    const jsonFields = [
      "salary",
      "emergencyContact",
      "social",
      "education",
      "bankAccounts",
    ];

    jsonFields.forEach((field) => {
      if (payload[field] !== undefined && typeof payload[field] === "string") {
        try {
          payload[field] = JSON.parse(payload[field]);
        } catch (err) {
          throw new Error(`Invalid JSON format for field: ${field}`);
        }
      }
    });

    if (file?.buffer) {
      const imageName = `teacher-${Date.now()}`;
      const { secure_url } = await sendImageToCloudinary(
        imageName,
        file.buffer
      );

      payload.thumbnail = secure_url;
    }

    const result = await Teacher.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new Error("Teacher not found");
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
// const updateTeacher = async (id, file, payload) => {
//   try {
//     if (file?.buffer) {
//       const imageName = `teacher-${Date.now()}`;
//       const { secure_url } = await sendImageToCloudinary(
//         imageName,
//         file.buffer
//       );

//       payload.thumbnail = secure_url;
//     }

//     const result = await Teacher.findByIdAndUpdate(id, payload, {
//       new: true,
//       runValidators: true,
//     });

//     return result;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

const deleteTeacher = async (id) => {
    const result = await Teacher.findByIdAndDelete(id);
    return result;
}

export const TeacherServices = {
    createTeacher,
    getAllTeacher,
    getSingleTeacher,
    updateTeacher,
    deleteTeacher
}
