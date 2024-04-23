import { createClient } from "@redis/client";

export const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await client.connect();
  return client;
};
