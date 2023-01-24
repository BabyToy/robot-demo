import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const redis = createClient({ url });

redis.on("error", (error) => {
  console.log("Redis error", error);
});

redis.on("connect", () => {
  console.log("Controller connected");
});

export const connect = async () => {
  redis.connect();
}

export const disconnect = async () => {
  redis.disconnect();
}