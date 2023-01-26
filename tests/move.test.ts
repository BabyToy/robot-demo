import dotenv from "dotenv";
import { describe } from "node:test";

import { moveRobot } from "../src/board";
import { Direction, IRobot } from "../src/common";
import MovementError from "../src/errors/movement";
import { EdgeFall } from "../src/errors/texts";

dotenv.config();

const maxX = parseInt(process.env.BOARD_WIDTH ?? "5");
const maxY = parseInt(process.env.BOARD_HEIGHT ?? "5");

describe("MOVE tests", () => {
  let robot: IRobot;

  beforeEach(() => {
    robot = {
      direction: Direction.EAST,
      position: { x: 1, y: 1 },
    };
  });

  test("Fall off N edge", () => {
    robot = { direction: Direction.NORTH, position: { x: 1, y: maxY } };

    const move = () => moveRobot(robot);
    expect(move).toThrow(MovementError);
    expect(move).toThrow(EdgeFall.NORTH);
  });

  test("Fall off S edge", () => {
    robot = { direction: Direction.SOUTH, position: { x: 1, y: 1 } };

    const move = () => moveRobot(robot);
    expect(move).toThrow(MovementError);
    expect(move).toThrow(EdgeFall.SOUTH);
  });

  test("Fall off E edge", () => {
    robot = { direction: Direction.EAST, position: { x: maxX, y: 1 } };

    const move = () => moveRobot(robot);
    expect(move).toThrow(MovementError);
    expect(move).toThrow(EdgeFall.EAST);
  });

  test("Fall off W edge", () => {
    robot = { direction: Direction.WEST, position: { x: 1, y: 1 } };

    const move = () => moveRobot(robot);
    expect(move).toThrow(MovementError);
    expect(move).toThrow(EdgeFall.WEST);
  });

  test("Move one space N", () => {
    robot = { direction: Direction.NORTH, position: { x: 1, y: 1 } };

    const result = moveRobot(robot);
    expect(result).toStrictEqual({ x: 1, y: 2 });
  });

  test("Move one space S", () => {
    robot = { direction: Direction.SOUTH, position: { x: 1, y: 2 } };

    const result = moveRobot(robot);
    expect(result).toStrictEqual({ x: 1, y: 1 });
  });

  test("Move one space E", () => {
    robot = { direction: Direction.EAST, position: { x: 1, y: 1 } };

    const result = moveRobot(robot);
    expect(result).toStrictEqual({ x: 2, y: 1 });
  });

  test("Move one space W", () => {
    robot = { direction: Direction.WEST, position: { x: maxX, y: 1 } };

    const result = moveRobot(robot);
    expect(result).toStrictEqual({ x: maxX - 1, y: 1 });
  });
});
