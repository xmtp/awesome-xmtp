import { createClient } from "@redis/client";

export const getRedisClient = async () => {
  try {
    console.log("Connecting to Redis...");
    const client = createClient({
      url: process.env.REDIS_CONNECTION_STRING,
      socket: {
        connectTimeout: 10000, // Timeout in milliseconds
      },
    });
    const redisPersistence = await import("@xmtp/redis-persistence");
    await client.connect();
    return {
      redisClient: client,
      redisConfig: {
        basePersistance: new redisPersistence.RedisPersistence(
          client as any,
          "xmtp:"
        ),
      },
    };
  } catch (error) {
    console.error(
      "Failed to connect to Redis. Please check the connection settings."
    );
    throw new Error("Redis connection failure"); // Throw a generic error message
  }
};
