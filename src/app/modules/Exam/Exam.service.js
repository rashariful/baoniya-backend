import { Exam } from "./Exam.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createExam = async (payload) => {
    const result = await Exam.create(payload);
    // If you want populated data immediately upon creation, use:
    // return await Exam.findById(result._id).populate("sessionId").populate("classGroupId");
    return result;
}

const getAllExam = async (query) => {
    const ExamSearchableFields = ["name"]; // Added name field as a searchable option if needed
    
    // Chain multiple .populate() calls for the referenced paths
    const resultQuery = new QueryBuilder(
        Exam.find().populate("sessionId").populate("classGroupId"), 
        query
    ).search(ExamSearchableFields).filter().sort().fields().paginate().limit();
    
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}

const getSingleExam = async (id) => {
    const result = await Exam.findById(id)
        .populate("sessionId")
        .populate("classGroupId");
    return result;
}

const updateExam = async (id, payload) => {
    const result = await Exam.findByIdAndUpdate(id, payload, { 
        new: true, 
        runValidators: true 
    })
    .populate("sessionId")
    .populate("classGroupId");
    
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