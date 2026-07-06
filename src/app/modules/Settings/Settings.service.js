
import { Settings } from "./Settings.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createSettings = async (payload) => {
    const result = await Settings.create(payload);
    return result;
}
const getAllSettings = async (query) => {
    const SettingsSearchableFields = [];
    const resultQuery = new QueryBuilder(Settings.find(), query).search(SettingsSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleSettings = async (id) => {
    const result = await Settings.findById(id);
    return result;
}
const updateSettings = async (id, payload) => {
    const result = await Settings.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteSettings = async (id) => {
    const result = await Settings.findByIdAndDelete(id);
    return result;
}

export const SettingsServices = {
    createSettings,
    getAllSettings,
    getSingleSettings,
    updateSettings,
    deleteSettings
}
