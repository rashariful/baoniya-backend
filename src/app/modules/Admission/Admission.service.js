
import { Admission } from "./Admission.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createAdmission = async (payload) => {
    const result = await Admission.create(payload);
    return result;
}
const getAllAdmission = async (query) => {
    const AdmissionSearchableFields = ["phone","fatherName","studentName"];
    const resultQuery = new QueryBuilder(Admission.find().populate("classId"), query).search(AdmissionSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleAdmission = async (id) => {
    const result = await Admission.findById(id);
    return result;
}
const updateAdmission = async (id, payload) => {
    const result = await Admission.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteAdmission = async (id) => {
    const result = await Admission.findByIdAndDelete(id);
    return result;
}

export const AdmissionServices = {
    createAdmission,
    getAllAdmission,
    getSingleAdmission,
    updateAdmission,
    deleteAdmission
}
