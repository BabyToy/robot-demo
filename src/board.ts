import { Command, Direction, ICommand } from "./common";
import RedisConnector from "./redisConnector";

const redisClient = new RedisConnector("Board subscriber");
const publisher = new RedisConnector("Board publisher");

const robot = {
  direction: Direction.NORTH,
  position: { x: 1, y: 1 },
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

const maxX = safeConvert(process.env.BOARD_WIDTH);
const maxY = safeConvert(process.env.BOARD_HEIGHT);

const boardKey = process.env.REDIS_FEEDBACK_KEY;
if (!boardKey) {
  throw new Error("REDIS_KEY undefined");
}

const publish = (message: string) => {
  publisher.redis.publish(boardKey, message);
};

export const initBoard = async () => {
  const key = process.env.REDIS_KEY;
  if (!key) {
    throw new Error("REDIS_KEY undefined");
  }

  await Promise.all([redisClient.connect(), publisher.connect()]);

  await redisClient.redis.subscribe(key, (message: string) => {
    const command: ICommand = JSON.parse(message);
    const posX = robot.position.x;
    const posY = robot.position.y;
    switch (command.instruction) {
      case Command.PLACE:
        const { position } = command;
        if (!position) {
          break;
        }
        if (position.x < 1 || position.x > maxX) {
          publish("Board: X-position is out of bounds");
          break;
        }
        if (position.y < 1 || position.y > maxY) {
          publish("Board: Y-position is out of bounds");
          break;
        }
        robot.position = { ...position };
        break;
      case Command.MOVE:
        switch (robot.direction) {
          case Direction.NORTH:
            if (posY === maxY) {
              publish("Bonk. Fell off the N edge");
              break;
            }
            robot.position.y = posY + 1;
            break;
          case Direction.SOUTH:
            if (posY === 1) {
              publish("Bonk. Fell off the S edge");
              break;
            }
            robot.position.y = posY - 1;
            break;
          case Direction.EAST:
            if (posX === maxX) {
              publish("Bonk. Fell off the E edge");
              break;
            }
            robot.position.x = posX + 1;
            break;
          case Direction.WEST:
            if (posX === 1) {
              publish("Bonk. Fell off the W edge");
              break;
            }
            robot.position.x = posX - 1;
            break;
          default:
            break;
        }
        break;
      case Command.RETREAT:
        switch (robot.direction) {
          case Direction.NORTH:
            if (posY === 1) {
              publish("Bonk. Fell off the S edge");
              break;
            }
            robot.position.y = posY - 1;
            break;
          case Direction.SOUTH:
            if (posY === maxY) {
              publish("Bonk. Fell off the N edge");
              break;
            }
            robot.position.y = posY + 1;
            break;
          case Direction.EAST:
            if (posX === 1) {
              publish("Bonk. Fell off the W edge");
              break;
            }
            robot.position.x = posX - 1;
            break;
          case Direction.WEST:
            if (posX === maxX) {
              publish("Bonk. Fell off the E edge");
              break;
            }
            robot.position.x = posX + 1;
            break;
          default:
            break;
        }
        break;
      case Command.LEFT:
        switch (robot.direction) {
          case Direction.NORTH:
            robot.direction = Direction.WEST;
            break;
          case Direction.SOUTH:
            robot.direction = Direction.EAST;
            break;
          case Direction.EAST:
            robot.direction = Direction.NORTH;
            break;
          case Direction.WEST:
            robot.direction = Direction.SOUTH;
            break;
          default:
            break;
        }
        break;
      case Command.RIGHT:
        switch (robot.direction) {
          case Direction.NORTH:
            robot.direction = Direction.EAST;
            break;
          case Direction.SOUTH:
            robot.direction = Direction.WEST;
            break;
          case Direction.EAST:
            robot.direction = Direction.SOUTH;
            break;
          case Direction.WEST:
            robot.direction = Direction.NORTH;
            break;
          default:
            break;
        }
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
