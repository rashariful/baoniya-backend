import dns from "dns";
import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/index.js";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
import notFound from "./app/middlewares/notFoundRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);


app.use(globalErrorHandler);
app.use(notFound);

let server;

async function main() {
  try {
    await mongoose.connect(config.database_url);

    const port = Number(process.env.PORT);

if (!port) {
  throw new Error("PORT is not defined");
}

server = app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running at port ${port}`);
});
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
}

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