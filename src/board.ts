import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

import { Command, Direction, ICommand } from "./common";

dotenv.config();

let redisClient: RedisClientType;

const key = process.env.REDIS_KEY;

if (!key) {
  throw new Error("REDIS_KEY undefined");
}

const robot = {
  direction: Direction.NORTH,
  position: { x: 0, y: 0 },
};

const safeConvert = (variable?: string) => {
  if (!variable) {
    throw new Error("Variable is undefined");
  }
  const result = parseInt(variable);
  if (isNaN(result)) {
    throw new Error("Variable must be a number");
  }
  return result;
};

const maxX = safeConvert(process.env.BOARD_WIDTH) - 1;
const maxY = safeConvert(process.env.BOARD_HEIGHT) - 1;

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
redisClient = createClient({ url });

redisClient.on("error", (error) => {
  console.log("Board: Redis error", error);
});

redisClient.on("connect", () => {
  console.log("Controller: Redis connected");
});

export const initBoard = async () => {
  await redisClient.connect();

  await redisClient.subscribe(key, (message: string) => {
    const command: ICommand = JSON.parse(message);
    switch (command.instruction) {
      case Command.PLACE:
        const { position } = command;
        if (!position) {
          console.log("Position is missing");
          break;
        }
        if (position.x < 0 || position.x >= maxX + 1) {
          console.log("Board: X-position is out of bounds");
          break;
        }
        if (position.y < 0 || position.y >= maxY + 1) {
          console.log("Y-position is out of bounds");
          break;
        }
        robot.position = { ...position };
        break;
      case Command.DIRECTION:
        if (!command.direction) {
          throw new Error("Direction is missing");
        }
        robot.direction = command.direction;
        break;
      case Command.REPORT:
        console.dir(robot);
      default:
        break;
    }
  });
};
