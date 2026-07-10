import axios from "axios";
import config from "../config/index.js";

const sendSMS = async (number, message) => {
  const url = config.bulk_sms.url;

  const data = {
    api_key: config.bulk_sms.api_key,
    senderid: config.bulk_sms.sender_id,
    number: number,
    message: message,
  };

  try {
    const response =
      config.node_env === "production"
        ? await axios.post(url, data)
        : { data: "SMS sent in development" };

    console.log(response.data, "✅ single sms response");
    return response.data;
  } catch (error) {
    console.log(error?.response?.data || error.message, "❌ single sms error");
    throw error;
  }
};

const sendBulkSMS = async (numbers, message) => {
  const smsData = {
    api_key: config.bulk_sms.api_key,
    senderid: config.bulk_sms.sender_id,
    number: numbers.join(","),
    message: message,
  };

  try {
    const response =
      config.node_env === "production"
        ? await axios.post(config.bulk_sms.url, smsData)
        : { data: "SMS sent in development" };

    console.log(response.data, "✅ bulk sms response");
    return response.data;
  } catch (error) {
    console.log(error?.response?.data || error.message, "❌ bulk sms error");
    throw error;
  }
};

export const SmsSender = {
  sendSMS,
  sendBulkSMS,
};