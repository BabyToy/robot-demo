import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
import { Command } from "./common";

dotenv.config();

let redisClient: RedisClientType;

const key = process.env.REDIS_KEY;
if (!key) {
  throw new Error("REDIS_KEY undefined");
}

export const initRobot = async () => {
  const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  redisClient = createClient({ url });

  redisClient.on("error", (error) => {
    console.log("Board redis error", error);
  });

  redisClient.on("connect", () => {
    console.log("Board: Redis connected");
  });

  await redisClient.connect();

  await redisClient.subscribe(key, (message: string) => {
    const command: Command = JSON.parse(message);
    console.log(`Received message: ${JSON.stringify(command)}`);
  });
};
