import { SmsSender } from "../../middlewares/smsSender.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";

const sendSingleSms = catchAsync(async (req, res) => {
  const { number, message } = req.body;

  const response = await SmsSender.sendSMS(number, message);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "SMS sent successfully",
    data: response,
  });
});

const sendBulkSms = catchAsync(async (req, res) => {
  const { numbers, message } = req.body;

  const response = await SmsSender.sendBulkSMS(numbers, message);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Bulk SMS sent successfully",
    data: response,
  });
});

export const SmsController = {
  sendSingleSms,
  sendBulkSms,
};