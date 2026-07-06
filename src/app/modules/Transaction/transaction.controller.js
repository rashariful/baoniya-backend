import { TransactionService } from "./transaction.service.js";


export const TransactionController = {
  create: async (req, res) => {
    try {
      const result = await TransactionService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await TransactionService.getAll();
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getIncome: async (req, res) => {
    try {
      const result = await TransactionService.getByType("income");
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getExpense: async (req, res) => {
    try {
      const result = await TransactionService.getByType("expense");
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const result = await TransactionService.update(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await TransactionService.delete(req.params.id);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
