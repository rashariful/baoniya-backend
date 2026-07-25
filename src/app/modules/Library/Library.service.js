
import { Library } from "./Library.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createLibrary = async (payload) => {
    const result = await Library.create(payload);
    return result;
}
const getAllLibrary = async (query) => {
    const LibrarySearchableFields = [];
    const resultQuery = new QueryBuilder(Library.find(), query).search(LibrarySearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleLibrary = async (id) => {
    const result = await Library.findById(id);
    return result;
}
const updateLibrary = async (id, payload) => {
    const result = await Library.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteLibrary = async (id) => {
    const result = await Library.findByIdAndDelete(id);
    return result;
}

export const LibraryServices = {
    createLibrary,
    getAllLibrary,
    getSingleLibrary,
    updateLibrary,
    deleteLibrary
}
