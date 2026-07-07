
import { StudentAcademicRecord } from "./StudentAcademicRecord.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createStudentAcademicRecord = async (payload) => {
    const result = await StudentAcademicRecord.create(payload);
    return result;
}
const getAllStudentAcademicRecord = async (query) => {
    const StudentAcademicRecordSearchableFields = [];
    const resultQuery = new QueryBuilder(StudentAcademicRecord.find(), query).search(StudentAcademicRecordSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleStudentAcademicRecord = async (id) => {
    const result = await StudentAcademicRecord.findById(id);
    return result;
}
const updateStudentAcademicRecord = async (id, payload) => {
    const result = await StudentAcademicRecord.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteStudentAcademicRecord = async (id) => {
    const result = await StudentAcademicRecord.findByIdAndDelete(id);
    return result;
}

export const StudentAcademicRecordServices = {
    createStudentAcademicRecord,
    getAllStudentAcademicRecord,
    getSingleStudentAcademicRecord,
    updateStudentAcademicRecord,
    deleteStudentAcademicRecord
}
