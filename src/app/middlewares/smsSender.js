import axios from "axios";
import config from "../config/index.js";
// import config from "../config/index.js";
// import { errorlogger, logger } from "../config/logger.js";

const sendSMS = async (number, message) => {
  const url = config.bulk_sms.url;
 

//   console.log(url, "smssender url log")

  const data = {
    api_key: config.bulk_sms.api_key,
    senderid: config.bulk_sms.sender_id,
    number: number,
    message: message,
  };

//   console.log(data, "sms data from sms sender")
  try {
    const response =
      config.node_env === "production"
        ? await axios.post(url, data)
        : { data: "SMS sent in development" };

    // logger.info(
    //   `SMS sent to ${number} with message: ${message}. Response: ${response.data}`
    // );

    console.log(response)
    return response.data;
  } catch (error) {
   
   console.log(error)
   
    
  }
};

// const sendBulkSMS = async (numbers, message) => {
//   const smsData = {
//     api_key: config.bulk_sms.api_key,
//     senderid: config.bulk_sms.sender_id,
//     number: numbers.join(","),
//     message: message,
//   };

//   try {
//     const response =
//       config.node_env === "production"
//         ? await axios.post(config.bulk_sms.url, smsData)
//         : { data: "SMS sent in development" };

//     logger.info(
//       `Bulk SMS sent to ${numbers.length} numbers with message: ${message}. Response: ${response.data}`
//     );

//     return response.data;
//   } catch (error) {
//     errorlogger.error(
//       "Error sending SMS:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// };

export const SmsSender = {
  sendSMS,
//   sendBulkSMS,
};
