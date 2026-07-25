
import { Asset } from "./Asset.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createAsset = async (payload) => {
    const result = await Asset.create(payload);
    return result;
}
const getAllAsset = async (query) => {
    const AssetSearchableFields = [];
    const resultQuery = new QueryBuilder(Asset.find(), query).search(AssetSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleAsset = async (id) => {
    const result = await Asset.findById(id);
    return result;
}
const updateAsset = async (id, payload) => {
    const result = await Asset.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteAsset = async (id) => {
    const result = await Asset.findByIdAndDelete(id);
    return result;
}

export const AssetServices = {
    createAsset,
    getAllAsset,
    getSingleAsset,
    updateAsset,
    deleteAsset
}
