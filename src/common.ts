export enum Direction {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}

export enum Command {
  PLACE = "PLACE",
  DIRECTION = "DIRECTION",
  MOVE = "MOVE",
  RETREAT = "RETREAT",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  REPORT = "REPORT",
}

/**
 * One-index coordinate
 * (1, 1) default position
 */
export interface IPosition {
  x: number;
  y: number;
}

export interface ICommand {
  instruction: Command;
  position?: IPosition;
  direction?: Direction;
}

export interface IRobot {
  direction: Direction;
  position: IPosition;
}
