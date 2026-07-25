
import { GradingScale } from "./GradingScale.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createGradingScale = async (payload) => {
    const result = await GradingScale.create(payload);
    return result;
}
const getAllGradingScale = async (query) => {
    const GradingScaleSearchableFields = [];
    const resultQuery = new QueryBuilder(GradingScale.find(), query).search(GradingScaleSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleGradingScale = async (id) => {
    const result = await GradingScale.findById(id);
    return result;
}
const updateGradingScale = async (id, payload) => {
    const result = await GradingScale.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteGradingScale = async (id) => {
    const result = await GradingScale.findByIdAndDelete(id);
    return result;
}

export const GradingScaleServices = {
    createGradingScale,
    getAllGradingScale,
    getSingleGradingScale,
    updateGradingScale,
    deleteGradingScale
}
