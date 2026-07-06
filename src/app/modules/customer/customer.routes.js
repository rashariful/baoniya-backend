
import express from "express";

import {
  CustomerControllers,
} from "./customer.controller.js";

const router = express.Router();

router.post("/", 
CustomerControllers.createCustomer);
router.get("/", 
CustomerControllers.getAllCustomer);
router.get("/:id", 
CustomerControllers.getSingleCustomer);
router.patch("/:id", 
CustomerControllers.updateCustomer);
router.delete("/:id", 
CustomerControllers.deleteCustomer);

export const CustomerRoutes = router;
