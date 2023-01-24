import { Command, Direction, ICommand } from "./common";
import RedisConnector from "./redisConnector";

const redisClient = new RedisConnector();
const publisher = new RedisConnector();

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

export const initBoard = async () => {
  const key = process.env.REDIS_KEY;
  if (!key) {
    throw new Error("REDIS_KEY undefined");
  }

  const boardKey = process.env.REDIS_FEEDBACK_KEY;
  if (!boardKey) {
    throw new Error("REDIS_KEY undefined");
  }

  await Promise.all([
    redisClient.connect(),
    publisher.connect()
  ]);

  await redisClient.redis.subscribe(key, (message: string) => {
    const command: ICommand = JSON.parse(message);
    switch (command.instruction) {
      case Command.PLACE:
        const { position } = command;
        if (!position) {
          break;
        }
        if (position.x < 0 || position.x >= maxX + 1) {
          redisClient.redis.publish(
            boardKey,
            "Board: X-position is out of bounds"
          );
          break;
        }
        if (position.y < 0 || position.y >= maxY + 1) {
          redisClient.redis.publish(
            boardKey,
            "Board: Y-position is out of bounds"
          );
          break;
        }
        robot.position = { ...position };
        break;
      case Command.DIRECTION:
        if (!command.direction) {
          break;
        }
        robot.direction = command.direction;
        break;
      case Command.REPORT:
        publisher.redis.publish(boardKey, JSON.stringify(robot));
        break;
      default:
        break;
    }
  });
};
