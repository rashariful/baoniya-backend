
import { Section } from "./Section.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createSection = async (payload) => {
    const result = await Section.create(payload);
    return result;
}
const getAllSection = async (query) => {
    const SectionSearchableFields = [];
    const resultQuery = new QueryBuilder(Section.find().populate("classId"), query).search(SectionSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleSection = async (id) => {
    const result = await Section.findById(id);
    return result;
}
const updateSection = async (id, payload) => {
    const result = await Section.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteSection = async (id) => {
    const result = await Section.findByIdAndDelete(id);
    return result;
}

export const SectionServices = {
    createSection,
    getAllSection,
    getSingleSection,
    updateSection,
    deleteSection
}
