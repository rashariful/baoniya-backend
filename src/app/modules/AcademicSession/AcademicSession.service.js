
import { AcademicSession } from "./AcademicSession.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createAcademicSession = async (payload) => {
    const result = await AcademicSession.create(payload);
    return result;
}
const getAllAcademicSession = async (query) => {
    const AcademicSessionSearchableFields = [];
    const resultQuery = new QueryBuilder(AcademicSession.find(), query).search(AcademicSessionSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleAcademicSession = async (id) => {
    const result = await AcademicSession.findById(id);
    return result;
}
const updateAcademicSession = async (id, payload) => {
    const result = await AcademicSession.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteAcademicSession = async (id) => {
    const result = await AcademicSession.findByIdAndDelete(id);
    return result;
}

export const AcademicSessionServices = {
    createAcademicSession,
    getAllAcademicSession,
    getSingleAcademicSession,
    updateAcademicSession,
    deleteAcademicSession
}
