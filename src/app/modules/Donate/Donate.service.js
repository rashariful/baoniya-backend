
import { Donate } from "./Donate.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createDonate = async (payload) => {
    const result = await Donate.create(payload);
    return result;
}
const getAllDonate = async (query) => {
    const DonateSearchableFields = ["donorName", "phone"];
    const resultQuery = new QueryBuilder(Donate.find(), query).search(DonateSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleDonate = async (id) => {
    const result = await Donate.findById(id);
    return result;
}
const updateDonate = async (id, payload) => {
    const result = await Donate.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteDonate = async (id) => {
    const result = await Donate.findByIdAndDelete(id);
    return result;
}

export const DonateServices = {
    createDonate,
    getAllDonate,
    getSingleDonate,
    updateDonate,
    deleteDonate
}
