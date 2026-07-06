import express from "express";
import { TransactionController } from "./transaction.controller.js";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware.js";
// import { verifyToken } from "../../middlewares/authMiddleware.js";



const router = express.Router();

router.post("/", TransactionController.create);
router.get("/", TransactionController.getAll);
router.get("/income", TransactionController.getIncome);
router.get("/expense", TransactionController.getExpense);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

export const TransactionRoutes = router;
