// import Redis from "ioredis";

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: 3,
// });

// redis.on("connect", () => {
//   console.log("✅ Redis Connected");
// });

// redis.on("error", (err) => {
//   console.error("❌ Redis Error:", err);
// });

// export default redis;

// import { Redis } from "@upstash/redis";

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

// export default redis;

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;