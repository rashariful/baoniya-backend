
import { Device } from "./Device.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createDevice = async (payload) => {
    const result = await Device.create(payload);
    return result;
}
const getAllDevice = async (query) => {
    const DeviceSearchableFields = [];
    const resultQuery = new QueryBuilder(Device.find(), query).search(DeviceSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleDevice = async (id) => {
    const result = await Device.findById(id);
    return result;
}
const updateDevice = async (id, payload) => {
    const result = await Device.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteDevice = async (id) => {
    const result = await Device.findByIdAndDelete(id);
    return result;
}

export const DeviceServices = {
    createDevice,
    getAllDevice,
    getSingleDevice,
    updateDevice,
    deleteDevice
}
