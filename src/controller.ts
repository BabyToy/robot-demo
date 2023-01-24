import process from "process";

import { Command, Direction, ICommand } from "./common";
import RedisConnector from "./redisConnector";

const key = process.env.REDIS_KEY;
if (!key) {
  throw new Error("REDIS_KEY undefined");
}

const connector = new RedisConnector("Controller publisher");

export const initController = async () => {
  await connector.connect();
};

export const parseCommands = (commands: string[]) => {
  // convert string to enum
  const instruction = <Command>commands[0];
  switch (instruction) {
    case Command.PLACE:
      if (!commands[1]) {
        throw new Error("Invalid position");
      }
      const [x, y] = commands[1].split(",");
      sendCommand({
        instruction,
        position: { x: parseInt(x), y: parseInt(y) },
      });
      break;
    case Command.DIRECTION:
      // is command a valid direction?
      if (!Object.keys(Direction).includes(commands[1])) {
        throw new Error("Invalid direction");
      }
      // convert string to enum
      const direction = <Direction>commands[1];
      sendCommand({ instruction, direction });
      break;
    default:
      // handle LEFT, RIGHT, RETREAT and REPORT here
      sendCommand({ instruction });
      break;
  }
};

export const sendCommand = async (command: ICommand) => {
  const { instruction } = command;
  switch (instruction) {
    case Command.PLACE:
      const { position } = command;
      if (!position) {
        throw new Error("Missing position");
      }
      if (isNaN(position.x) || isNaN(position.y)) {
        throw new Error("Invalid position");
      }
      break;
    case Command.MOVE:
    case Command.LEFT:
    case Command.RIGHT:
    case Command.DIRECTION:
    case Command.REPORT:
    case Command.RETREAT:
      break;
    default:
      throw new Error("Invalid command");
  }
  await connector.redis.publish(key, JSON.stringify(command));
};
