
import { Teacher } from "./Teacher.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { createTeacherWithCredentials } from "../../utils/teacher.utils.js";

// Declare the Services 


const createTeacher = async (payload) => {
  const result = await createTeacherWithCredentials(payload);
  return result;
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
const updateTeacher = async (id, payload) => {
    const result = await Teacher.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
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
