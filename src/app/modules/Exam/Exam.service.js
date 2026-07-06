
import { Exam } from "./Exam.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createExam = async (payload) => {
    const result = await Exam.create(payload);
    return result;
}
const getAllExam = async (query) => {
    const ExamSearchableFields = [];
    const resultQuery = new QueryBuilder(Exam.find(), query).search(ExamSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleExam = async (id) => {
    const result = await Exam.findById(id);
    return result;
}
const updateExam = async (id, payload) => {
    const result = await Exam.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteExam = async (id) => {
    const result = await Exam.findByIdAndDelete(id);
    return result;
}

export const ExamServices = {
    createExam,
    getAllExam,
    getSingleExam,
    updateExam,
    deleteExam
}
