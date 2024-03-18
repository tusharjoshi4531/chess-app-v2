import Redis from "ioredis";
import { REDIS_PUBSUB_URL } from "../config/config";

export function createPubSubClients() {
  const pubCLient = REDIS_PUBSUB_URL
    ? new Redis(REDIS_PUBSUB_URL)
    : new Redis();
  const subClient = pubCLient.duplicate();

  pubCLient.on("connect", () => {
    console.log("connected to redis publisher");
  });

  subClient.on("connect", () => {
    console.log("connected to redis subscriber");
  });

  return { pubCLient, subClient };
}
