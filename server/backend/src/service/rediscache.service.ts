import Redis from "ioredis";
import { REDIS_CACHE_URL, TEN_MINUTES_IN_MS } from "../config/config";

const client =
  REDIS_CACHE_URL === "local" ? new Redis() : new Redis(REDIS_CACHE_URL);

client.on("connect", () => {
  console.log("connected to redis");
});

client.on("error", (err) => {
  console.log("Error Connecting Redis:" + err);
});

export async function getCache<T>(
  key: string,
  refreshTime = TEN_MINUTES_IN_MS
) {
  const data = await client.get(key);

  if (data) {
    console.log("cache hit->", key);
    const result = JSON.parse(data) as T;
    setCache(key, result, refreshTime);
    return result;
  }
  return null;
}

export async function setCache<T>(
  key: string,
  value: T,
  time: number = TEN_MINUTES_IN_MS
) {
  return client.set(key, JSON.stringify(value), "EX", time);
}

export async function deleteCache(key: string) {
  return client.del(key);
}

export default client;
