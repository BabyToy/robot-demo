import { Command, Direction, ICommand, IPosition, IRobot } from "./common";
import MovementError from "./errors/movement";
import PositionError from "./errors/position";
import { EdgeFall } from "./errors/texts";
import RedisConnector from "./redisConnector";

const redisClient = new RedisConnector("Board subscriber");
const publisher = new RedisConnector("Board publisher");

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
const Increment = safeConvert(process.env.INCREMENT ?? "1");

const boardKey = process.env.REDIS_FEEDBACK_KEY;
if (!boardKey) {
  throw new Error("REDIS_KEY undefined");
}

const publish = (message: string) => {
  publisher.redis.publish(boardKey, message);
};

export const moveRobot = (robot: IRobot, distance: number = Increment): IPosition => {
  let { x, y } = { ...robot.position };
  const direction = robot.direction;
  switch (direction) {
    case Direction.NORTH:
      y = y + distance;
      break;
    case Direction.SOUTH:
      y = y - distance;
      break;
    case Direction.EAST:
      x = x + distance;
      break;
    case Direction.WEST:
      x = x - distance;
      break;
    default:
      break;
  }

  if (y > maxY) {
    throw new MovementError(EdgeFall.NORTH);
  }
  if (y === 0) {
    throw new MovementError(EdgeFall.SOUTH);
  }
  if (x > maxX) {
    throw new MovementError(EdgeFall.EAST);
  }
  if (x === 0) {
    throw new MovementError(EdgeFall.WEST);
  }
  return { x, y };
};

export const placeRobot = (position: IPosition): IPosition => {
  if (position.x < 1 || position.x > maxX) {
    throw new PositionError("X-position is out of bounds");
  }
  if (position.y < 1 || position.y > maxY) {
    throw new PositionError("Y-position is out of bounds");
  }
  return position;
};

export const turnRobotLeft = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.NORTH:
      return Direction.WEST;
    case Direction.SOUTH:
      return Direction.EAST;
    case Direction.EAST:
      return Direction.NORTH;
    default:
      // west
      return Direction.SOUTH;
  }
  return direction;
};

export const turnRobotRight = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.NORTH:
      return Direction.EAST;
    case Direction.SOUTH:
      return Direction.WEST;
    case Direction.EAST:
      return Direction.SOUTH;
    default:
      // west
      return Direction.NORTH;
  }
};

export const turnRobotTo = (direction: Direction): Direction => {
  return direction;
}

export const robotStatus = (robot: IRobot) => {
  return { ...robot };
};

export const initBoard = async () => {
  const key = process.env.REDIS_KEY;
  if (!key) {
    throw new Error("REDIS_KEY undefined");
  }

  await Promise.all([redisClient.connect(), publisher.connect()]);

  const robot: IRobot = {
    direction: Direction.NORTH,
    position: { x: 1, y: 1 },
  };

  await redisClient.redis.subscribe(key, (message: string) => {
    const command: ICommand = JSON.parse(message);
    switch (command.instruction) {
      case Command.PLACE:
        if (!command.position) {
          break;
        }
        try {
          robot.position = placeRobot(command.position);
        } catch (error) {
          if (error instanceof PositionError) {
            publish(`Board: ${error.message}`);
          } else {
            throw error;
          }
        }
        break;
      case Command.MOVE:
        try {
          robot.position = moveRobot(robot);
        } catch (error) {
          if (error instanceof MovementError) {
            publish(`Board: ${error.message}`);
          } else {
            throw error;
          }
        }
        break;
      case Command.RETREAT:
        try {
          robot.position = moveRobot(robot, -Increment);
        } catch (error) {
          if (error instanceof MovementError) {
            publish(`Board: ${error.message}`);
          } else {
            throw error;
          }
        }
        break;
      case Command.LEFT:
        robot.direction = turnRobotLeft(robot.direction);
        break;
      case Command.RIGHT:
        robot.direction = turnRobotRight(robot.direction);
        break;
      case Command.DIRECTION:
        if (!command.direction) {
          break;
        }
        robot.direction = turnRobotTo(command.direction);
        break;
      case Command.REPORT:
        publish(JSON.stringify(robotStatus(robot)));
        break;
      default:
        break;
    }
  });
};
