
import { Classes } from "./Classes.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createClasses = async (payload) => {
    const result = await Classes.create(payload);
    return result;
}
const getAllClasses = async (query) => {
    const ClassesSearchableFields = [];
    const resultQuery = new QueryBuilder(Classes.find(), query).search(ClassesSearchableFields).filter().sort().fields().paginate().limit();
    // const resultQuery = new QueryBuilder(Classes.find().populate("teacherId"), query).search(ClassesSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleClasses = async (id) => {
    const result = await Classes.findById(id);
    return result;
}
const updateClasses = async (id, payload) => {
    const result = await Classes.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteClasses = async (id) => {
    const result = await Classes.findByIdAndDelete(id);
    return result;
}

export const ClassesServices = {
    createClasses,
    getAllClasses,
    getSingleClasses,
    updateClasses,
    deleteClasses
}
