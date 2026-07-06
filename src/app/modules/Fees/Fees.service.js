import { Fees } from "./Fees.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services

const createFees = async (payload) => {
  const result = await Fees.create(payload);
  return result;
};
const getAllFees = async (query) => {
  const FeesSearchableFields = [];
  const resultQuery = new QueryBuilder(Fees.find().populate("studentId"), query)
    .search(FeesSearchableFields)
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
const getSingleFees = async (id) => {
  const result = await Fees.findById(id);
  return result;
};
const updateFees = async (id, payload) => {
  const result = await Fees.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteFees = async (id) => {
  const result = await Fees.findByIdAndDelete(id);
  return result;
};

export const FeesServices = {
  createFees,
  getAllFees,
  getSingleFees,
  updateFees,
  deleteFees,
};
