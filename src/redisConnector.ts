import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config();

export default class RedisConnector {
  private _redis: RedisClientType;

  constructor(source: string) {
    const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

    this._redis = createClient({ url });

    this._redis.on("error", (error) => {
      console.log("Redis error", error);
    });

    this._redis.on("connect", () => {
      console.log(`${source} connected`);
    });
  }

  public get redis(): RedisClientType {
    return this._redis;
  }

  public connect = async () => {
    this._redis.connect();
  };

  public disconnect = async () => {
    this._redis.disconnect();
  };
}
