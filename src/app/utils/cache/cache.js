import redis from "./redisClient.js";

export const getCache = (keyBuilder, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);

      // ─── CACHE HIT ───
      const cached = await redis.get(key);

      if (cached) {
        console.log(`✅ Cache HIT: ${key}`);
        // cached already parsed by Upstash
        return res.status(200).json(cached);
      }

      console.log(`🐢 Cache MISS: ${key}`);

      // ─── INTERCEPT res.json ───
      const originalJson = res.json.bind(res);

      res.json = function (data) {
        // fire and forget — don't await, don't block response
        redis.set(key, data, { ex: ttl }).catch((err) => {
          console.error("❌ Redis set error:", err);
        });

        return originalJson(data); // immediately return
      };

      next();
    } catch (error) {
      console.error("❌ Cache middleware error:", error);
      next(); // cache fail হলে normal flow চলবে
    }
  };
};

export const setCache = async (key, data, ttl = 60) => {
  try {
    await redis.set(key, data, { ex: ttl });
  } catch (error) {
    console.error("❌ Redis setCache error:", error);
  }
};

export const getManualCache = async (key) => {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error("❌ Redis getCache error:", error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("❌ Redis delete error:", error);
  }
};

export const clearCacheByPrefix = async (prefix) => {
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("❌ Redis clear prefix error:", error);
  }
};


// import redis from "./redisClient.js";

// /**
//  * Cache Middleware
//  * Example: getCache(() => "faq:list", 600)
//  */
// export const getCache = (keyBuilder, ttl = 60) => {
//   return async (req, res, next) => {
//     try {
//       const key = keyBuilder(req);

//       const cached = await redis.get(key);

//       if (cached) {
//         return res.status(200).json({
//           success: true,
//           source: "cache",
//           data: cached,
//         });
//       }

//       // intercept response to save cache
//       const originalJson = res.json.bind(res);

//       res.json = async (data) => {
//         try {
//           const payload = data?.data || data;
//           await redis.set(key, payload, { ex: ttl });
//         } catch (err) {
//           console.error("❌ Redis setCache error:", err);
//         }

//         return originalJson(data);
//       };

//       next();
//     } catch (error) {
//       console.error("❌ Cache middleware error:", error);
//       next();
//     }
//   };
// };

// /**
//  * Manual cache setter
//  */
// export const setCache = async (key, data, ttl = 60) => {
//   try {
//     await redis.set(key, data, { ex: ttl });
//   } catch (error) {
//     console.error("❌ Redis setCache error:", error);
//   }
// };

// /**
//  * Manual cache getter
//  */
// export const getManualCache = async (key) => {
//   try {
//     return await redis.get(key);
//   } catch (error) {
//     console.error("❌ Redis getCache error:", error);
//     return null;
//   }
// };

// /**
//  * Delete single cache
//  */
// export const deleteCache = async (key) => {
//   try {
//     await redis.del(key);
//   } catch (error) {
//     console.error("❌ Redis delete error:", error);
//   }
// };

// /**
//  * Clear cache by prefix
//  */
// export const clearCacheByPrefix = async (prefix) => {
//   try {
//     const keys = await redis.keys(`${prefix}*`);

//     if (keys.length) {
//       await redis.del(...keys);
//     }
//   } catch (error) {
//     console.error("❌ Redis clear prefix error:", error);
//   }
// };