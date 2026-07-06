
import { Examination } from "./Examination.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createExamination = async (payload) => {
    const result = await Examination.create(payload);
    return result;
}
const getAllExamination = async (query) => {
    const ExaminationSearchableFields = [];
    const resultQuery = new QueryBuilder(Examination.find(), query).search(ExaminationSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleExamination = async (id) => {
    const result = await Examination.findById(id);
    return result;
}
const updateExamination = async (id, payload) => {
    const result = await Examination.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteExamination = async (id) => {
    const result = await Examination.findByIdAndDelete(id);
    return result;
}

export const ExaminationServices = {
    createExamination,
    getAllExamination,
    getSingleExamination,
    updateExamination,
    deleteExamination
}
