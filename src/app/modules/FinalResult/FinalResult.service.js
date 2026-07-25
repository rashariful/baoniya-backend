
import { FinalResult } from "./FinalResult.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createFinalResult = async (payload) => {
    const result = await FinalResult.create(payload);
    return result;
}
const getAllFinalResult = async (query) => {
    const FinalResultSearchableFields = [];
    const resultQuery = new QueryBuilder(FinalResult.find(), query).search(FinalResultSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleFinalResult = async (id) => {
    const result = await FinalResult.findById(id);
    return result;
}
const updateFinalResult = async (id, payload) => {
    const result = await FinalResult.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteFinalResult = async (id) => {
    const result = await FinalResult.findByIdAndDelete(id);
    return result;
}

export const FinalResultServices = {
    createFinalResult,
    getAllFinalResult,
    getSingleFinalResult,
    updateFinalResult,
    deleteFinalResult
}
