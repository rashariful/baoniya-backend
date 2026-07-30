import { Classes } from "./Classes.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createClasses = async (payload) => {
    const result = await Classes.create(payload);
    // If you want populated data immediately upon creation, use:
    // return await Classes.findById(result._id).populate("classGroupId");
    return result;
}

const getAllClasses = async (query) => {
    const ClassesSearchableFields = ["name", "code"]; // Added name and code as searchable options
    
    const resultQuery = new QueryBuilder(
        Classes.find().populate("classGroupId"), 
        query
    ).search(ClassesSearchableFields).filter().sort().fields().paginate().limit();
    
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}

const getSingleClasses = async (id) => {
    const result = await Classes.findById(id).populate("classGroupId");
    return result;
}

const updateClasses = async (id, payload) => {
    const result = await Classes.findByIdAndUpdate(id, payload, { 
        new: true, 
        runValidators: true 
    }).populate("classGroupId");
    
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