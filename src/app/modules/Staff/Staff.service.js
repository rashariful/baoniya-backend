
import { Staff } from "./Staff.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createStaff = async (payload) => {
    const result = await Staff.create(payload);
    return result;
}
const getAllStaff = async (query) => {
    const StaffSearchableFields = [];
    const resultQuery = new QueryBuilder(Staff.find(), query).search(StaffSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleStaff = async (id) => {
    const result = await Staff.findById(id);
    return result;
}
const updateStaff = async (id, payload) => {
    const result = await Staff.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteStaff = async (id) => {
    const result = await Staff.findByIdAndDelete(id);
    return result;
}

export const StaffServices = {
    createStaff,
    getAllStaff,
    getSingleStaff,
    updateStaff,
    deleteStaff
}
