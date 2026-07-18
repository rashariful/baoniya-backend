import { Fees } from "./Fees.model.js";
import QueryBuilder from "../../helpers/QueryBuilder.js";
import { Student } from "../Student/Student.model.js";

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





const getMyFees = async (userId) => {
  const student = await Student.findOne({ userId });

  if (!student) {
    throw new Error("Student not found");
  }

  const fees = await Fees.find({ studentId: student._id })
    .sort({ createdAt: -1 });

  const summary = fees.reduce(
    (acc, fee) => {
      acc.totalFees += fee.amount;
      acc.totalPaid += fee.paidAmount;
      acc.totalDue += fee.dueAmount;
      return acc;
    },
    {
      totalFees: 0,
      totalPaid: 0,
      totalDue: 0,
      totalReceipts: fees.length,
    }
  );

  return {
    student,
    summary,
    history: fees,
  };
};


export const FeesServices = {
  createFees,
  getAllFees,
  getSingleFees,
  updateFees,
  deleteFees,
  getMyFees
};
