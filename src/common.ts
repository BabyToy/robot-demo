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
 * Zero-index coordinate
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
