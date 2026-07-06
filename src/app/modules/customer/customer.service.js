import { Customer } from "./customer.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";

// Declare the Services

const createCustomer = async (payload) => {
  const result = await Customer.create(payload);
  return result;
};
const getAllCustomer = async (query) => {
  const customerSearchableFields = ["name", "email", "contactNumber"];
  const resultQuery = new QueryBuilder(Customer.find(), query)
    .search(customerSearchableFields)
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
const getSingleCustomer = async (id) => {
  const result = await Customer.findById(id);
  return result;
};
const updateCustomer = async (id, payload) => {
  const result = await Customer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteCustomer = async (id) => {
  const result = await Customer.findByIdAndDelete(id);
  return result;
};

export const CustomerServices = {
  createCustomer,
  getAllCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
