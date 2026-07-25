
import { ClassGroup } from "./ClassGroup.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createClassGroup = async (payload) => {
    const result = await ClassGroup.create(payload);
    return result;
}
const getAllClassGroup = async (query) => {
    const ClassGroupSearchableFields = [];
    const resultQuery = new QueryBuilder(ClassGroup.find(), query).search(ClassGroupSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleClassGroup = async (id) => {
    const result = await ClassGroup.findById(id);
    return result;
}
const updateClassGroup = async (id, payload) => {
    const result = await ClassGroup.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteClassGroup = async (id) => {
    const result = await ClassGroup.findByIdAndDelete(id);
    return result;
}

export const ClassGroupServices = {
    createClassGroup,
    getAllClassGroup,
    getSingleClassGroup,
    updateClassGroup,
    deleteClassGroup
}
