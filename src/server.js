import "dotenv/config";           // ✅ সবার আগে - সব import এর top এ
import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/index.js";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
import notFound from "./app/middlewares/notFoundRoutes.js";

app.use(globalErrorHandler);
app.use(notFound);

let server;

async function main() {
  try {
    await mongoose.connect(config.database_url);
    server = app.listen(config.port, () => {
      console.log(`✅ Server running at port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
}

main();

process.on("unhandledRejection", (error, promise) => {
  console.log("❌ Unhandled rejection at:", promise, "reason:", error);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("❌ Uncaught exception:", error);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

// import mongoose from "mongoose";
// import app from "./app.js";
// import config from "./app/config/index.js";
// import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
// import notFound from "./app/middlewares/notFoundRoutes.js";

// // ✅ Register error handlers BEFORE starting the server
// app.use(globalErrorHandler);
// app.use(notFound);

// let server;

// async function main() {
//   try {
//     await mongoose.connect(config.database_url);
//     server = app.listen(config.port, () => {
//       console.log(`✅ Server running at port ${config.port}`);
//     });
//   } catch (error) {
//     console.error("❌ Server startup error:", error);
//     process.exit(1);
//   }
// }

// main();

// process.on("unhandledRejection", (error, promise) => {
//   console.log(
//     "❌ Shutting down the server due to unhandled rejection at:",
//     promise,
//     "with reason:",
//     error
//   );
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
// });

// process.on("uncaughtException", (error) => {
//   console.log(
//     "❌ Shutting down the server due to uncaught exception with reason:",
//     error
//   );
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
// });
