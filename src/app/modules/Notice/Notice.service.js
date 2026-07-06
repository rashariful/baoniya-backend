
import { Notice } from "./Notice.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createNotice = async (payload) => {
    const result = await Notice.create(payload);
    return result;
}
const getAllNotice = async (query) => {
    const NoticeSearchableFields = [];
    const resultQuery = new QueryBuilder(Notice.find(), query).search(NoticeSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleNotice = async (id) => {
    const result = await Notice.findById(id);
    return result;
}
const updateNotice = async (id, payload) => {
    const result = await Notice.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteNotice = async (id) => {
    const result = await Notice.findByIdAndDelete(id);
    return result;
}

export const NoticeServices = {
    createNotice,
    getAllNotice,
    getSingleNotice,
    updateNotice,
    deleteNotice
}
