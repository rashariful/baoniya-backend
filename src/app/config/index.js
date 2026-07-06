import dotenv from "dotenv";
import path from "path";

// FIXED: Correct path.join syntax
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  whatsapp_number: process.env.WHATSAPP_NUMBER,
  whatsapp_link: process.env.WHATSAPP_LINK,
  email: process.env.EMAIL_USER,
  app_password: process.env.EMAIL_PASS,

  courier: {
    steadfast: {  
      name: "steadfast",
      api_key: process.env.STEADFAST_API_KEY,
      secret_key: process.env.STEADFAST_SECRET_KEY,
      url: process.env.STEADFAST_BASE_URL,
      email: process.env.STEADFAST_EMAIL,
      password: process.env.STEADFAST_PASSWORD,
    },
  },

  bulk_sms: {
    api_key: process.env.BULK_SMS_BD_API_KEY,
    sender_id: process.env.BULK_SMS_BD_SENDER_ID,
    url: process.env.BULK_SMS_BD_URL,
  },
};

// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.join((process.cwd(), ".env")) });

// export default {
//   node_env: process.env.NODE_ENV,
//   port: process.env.PORT,
//   database_url: process.env.DATABASE_URL,
//   cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
//   cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
//   whatsapp_number: process.env.WHATSAPP_NUMBER,
//   whatsapp_link: process.env.WHATSAPP_LINK,
//   // ✅ EMAIL FIXED (IMPORTANT)
//   email: process.env.EMAIL_USER,
//   app_password: process.env.EMAIL_PASS,

// courier: {
//   steadfast: {  
//     name: "steadfast",
//     api_key: process.env.STEADFAST_API_KEY,
//     secret_key: process.env.STEADFAST_SECRET_KEY,
//     url: process.env.STEADFAST_BASE_URL,
//     email: process.env.STEADFAST_EMAIL,
//     password: process.env.STEADFAST_PASSWORD,
//   },
// },

//   bulk_sms: {
//     api_key: process.env.BULK_SMS_BD_API_KEY,
//     sender_id: process.env.BULK_SMS_BD_SENDER_ID,
//     url: process.env.BULK_SMS_BD_URL,
//   },
// };
