
import { SyncQueue } from "./SyncQueue.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createSyncQueue = async (payload) => {
    const result = await SyncQueue.create(payload);
    return result;
}
const getAllSyncQueue = async (query) => {
    const SyncQueueSearchableFields = [];
    const resultQuery = new QueryBuilder(SyncQueue.find(), query).search(SyncQueueSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleSyncQueue = async (id) => {
    const result = await SyncQueue.findById(id);
    return result;
}
const updateSyncQueue = async (id, payload) => {
    const result = await SyncQueue.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteSyncQueue = async (id) => {
    const result = await SyncQueue.findByIdAndDelete(id);
    return result;
}

export const SyncQueueServices = {
    createSyncQueue,
    getAllSyncQueue,
    getSingleSyncQueue,
    updateSyncQueue,
    deleteSyncQueue
}
