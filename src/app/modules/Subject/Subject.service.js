
import { Subject } from "./Subject.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createSubject = async (payload) => {
    const result = await Subject.create(payload);
    return result;
}
const getAllSubject = async (query) => {
    const SubjectSearchableFields = [];
    const resultQuery = new QueryBuilder(Subject.find().populate("classId"), query).search(SubjectSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleSubject = async (id) => {
    const result = await Subject.findById(id);
    return result;
}
const updateSubject = async (id, payload) => {
    const result = await Subject.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteSubject = async (id) => {
    const result = await Subject.findByIdAndDelete(id);
    return result;
}

export const SubjectServices = {
    createSubject,
    getAllSubject,
    getSingleSubject,
    updateSubject,
    deleteSubject
}
