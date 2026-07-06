// import { SmsSender } from "../../helpers/smsSender.js";
// import sendResponse from "../../utils/sendResponse.js";

import { SmsSender } from "../../middlewares/smsSender.js";
import sendResponse from "../../utils/sendResponse.js";


const sendSingleSms = async (req, res) => {
  const { number, message } = req.body;

  const response = await SmsSender.sendSMS(number, message);
  sendResponse(res, {
    success: true,
    message: "SMS sent successfully",
    data: response,
  });
};

const sendBulkSms = async (req, res) => {
  const { numbers, message } = req.body;

  const response = await SmsSender.sendBulkSMS(numbers, message);
  sendResponse(res, {
    success: true,
    message: "Bulk SMS sent successfully",
    data: response,
  });
};

export const SmsController = {
  sendSingleSms,
  sendBulkSms,
};
