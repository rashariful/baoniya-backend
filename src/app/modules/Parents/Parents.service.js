import { Parents } from "./Parents.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services

const createParents = async (payload) => {
  const result = await Parents.create(payload);
  return result;
};
const getAllParents = async (query) => {
  const ParentsSearchableFields = ["phone","fatherName","motherName"];
  const resultQuery = new QueryBuilder(
    Parents.find().populate("studentId"),
    query,
  )
    .search(ParentsSearchableFields)
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
const getSingleParents = async (id) => {
  const result = await Parents.findById(id);
  return result;
};
const updateParents = async (id, payload) => {
  const result = await Parents.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteParents = async (id) => {
  const result = await Parents.findByIdAndDelete(id);
  return result;
};

export const ParentsServices = {
  createParents,
  getAllParents,
  getSingleParents,
  updateParents,
  deleteParents,
};
