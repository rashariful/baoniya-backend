
import { ResultSetting } from "./ResultSetting.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services 

const createResultSetting = async (payload) => {
    const result = await ResultSetting.create(payload);
    return result;
}
const getAllResultSetting = async (query) => {
  const ResultSettingSearchableFields = [];

  const resultQuery = new QueryBuilder(
    ResultSetting.find()
      .populate({
        path: "sessionId",
        select: "year",
      })
      .populate({
        path: "classId",
        select: "name code",
      })
      .populate({
        path: "examId",
        select: "name",
      })
      .populate({
        path: "subjectCombination",
        select: "name code",
      }),
    query
  )
    .search(ResultSettingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();

  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return {
    data: result,
    meta,
  };
};
const getSingleResultSetting = async (id) => {
    const result = await ResultSetting.findById(id);
    return result;
}
const updateResultSetting = async (id, payload) => {
    const result = await ResultSetting.findByIdAndUpdate(id, payload, { new: true, runValidators: true});
    return result;
}
const deleteResultSetting = async (id) => {
    const result = await ResultSetting.findByIdAndDelete(id);
    return result;
}

export const ResultSettingServices = {
    createResultSetting,
    getAllResultSetting,
    getSingleResultSetting,
    updateResultSetting,
    deleteResultSetting
}
