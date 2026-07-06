
import { TrackConfig } from "./trackConfig.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createTrackConfig = async (payload) => {
    const result = await TrackConfig.create(payload);
    return result;
}
const getAllTrackConfig = async (query) => {
    const trackConfigSearchableFields = [];
    const resultQuery = new QueryBuilder(TrackConfig.find().populate("storeId", "name domain"), query).search(trackConfigSearchableFields).filter().sort().fields().paginate().limit();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();

    return {
        data: result,
        meta
    }
}
const getSingleTrackConfig = async (id) => {
    const result = await TrackConfig.findById(id);
    return result;
}
const updateTrackConfig = async (id, payload) => {
    const result = await TrackConfig.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteTrackConfig = async (id) => {
    const result = await TrackConfig.findByIdAndDelete(id);
    return result;
}

const getTrackingConfigByStoreId = async (storeId) => {
  const config = await TrackConfig.findOne({ storeId })
    .populate({
      path: "storeId",
      select: "name domain",
    })
    .lean();

  return config ?? null;
};

export const TrackConfigServices = {
    createTrackConfig,
    getAllTrackConfig,
    getSingleTrackConfig,
    updateTrackConfig,
    deleteTrackConfig,
    getTrackingConfigByStoreId
}
