import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./app/routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8080",
  "http://localhost:5000",
  "https://www.bajhs.edu.bd",
  "https://bajhs.edu.bd",
  "https://backoffice.bajhs.edu.bd",
  "https://www.backoffice.bajhs.edu.bd",
  "https://school.bajhs.edu.bd",
  "https://www.school.bajhs.edu.bd",

];


// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:8080",
//   "https://www.upayon.com",
//   "https://upayon.com",
//   "https://backoffice.upayon.com",
//   "https://www.backoffice.upayon.com",
//   "https://admin.upayon.com",
//   "https://www.admin.upayon.com",
// ];

const corsOptions = {
  origin: function (origin, callback) {
    // ✅ Development: Allow no origin (same-origin requests)
    // ✅ Production: Check against allowedOrigins
    if (!origin) {
      callback(null, true); // Same-origin request ✅
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allowed origin ✅
    } else {
      console.warn(`🚫 CORS blocked: ${origin}`);
      callback(new Error("CORS: Origin not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-store-domain"],
  exposedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 3600, // 1 hour cache for preflight
};

// ✅ Apply CORS middleware FIRST - before all routes
app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly for all routes
app.options("*", cors(corsOptions));

// ✅ Body parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "api-status.html"));
});

// ✅ Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "✅ Server is running",
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString(),
  });
});

// ✅ CORS Test Endpoint - মনিটর করতে পারবেন কোন origin ব্লক হচ্ছে কিনা
app.get("/api/v1/cors-test", cors(corsOptions), (req, res) => {
  res.json({
    success: true,
    message: "CORS is working correctly",
    origin: req.headers.origin || "no origin header",
    allowedOrigins: allowedOrigins,
  });
});

export default app;