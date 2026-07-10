import { Router } from "express";
import { SmsController } from "./sms.controller.js";

const router = Router();

router.post("/bulk", SmsController.sendBulkSms);
router.post("/", SmsController.sendSingleSms);

export const SmsRoutes = router;