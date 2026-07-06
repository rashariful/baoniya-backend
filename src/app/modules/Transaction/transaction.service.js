import { Transaction } from "./transaction.model.js";


export const TransactionService = {
  create: async (data) => {
    return await Transaction.create(data);
  },

  getAll: async () => {
    return await Transaction.find().sort({ createdAt: -1 });
  },

  getByType: async (type) => {
    return await Transaction.find({ type }).sort({ createdAt: -1 });
  },

  getById: async (id) => {
    return await Transaction.findById(id);
  },

  update: async (id, data) => {
    return await Transaction.findByIdAndUpdate(id, data, { new: true });
  },

  delete: async (id) => {
    return await Transaction.findByIdAndDelete(id);
  },
};
