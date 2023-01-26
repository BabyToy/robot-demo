import dotenv from "dotenv";
import { describe } from "node:test";

import { placeRobot } from "../src/board";
import { Direction, IRobot } from "../src/common";
import PositionError from "../src/errors/position";

dotenv.config();

const maxX = parseInt(process.env.BOARD_WIDTH ?? "5");
const maxY = parseInt(process.env.BOARD_HEIGHT ?? "5");

describe("PLACE tests", () => {
  let robot: IRobot;

  beforeEach(() => {
    robot = {
      direction: Direction.EAST,
      position: { x: 1, y: 1 },
    };
  });

  test("Invalid PLACE 0", () => {
    const handler = () => {
      placeRobot({ x: 0, y: 0 });
    };
    expect(handler).toThrow(PositionError);
  });

  test("Invalid PLACE 1", () => {
    const handler = () => {
      placeRobot({ x: -1, y: -1 });
    };
    expect(handler).toThrow(PositionError);
  });

  test("Invalid PLACE 1", () => {
    const handler = () => {
      placeRobot({ x: -1, y: -1 });
    };
    expect(handler).toThrow(PositionError);
  });

  test("Invalid PLACE X-axis", () => {
    const handler = () => {
      placeRobot({ x: maxX + 1, y: maxY });
    };
    expect(handler).toThrow(PositionError);
  });

  test("Invalid PLACE Y-axis", () => {
    const handler = () => {
      placeRobot({ x: 1, y: maxY + 1 });
    };
    expect(handler).toThrow(PositionError);
  });

  test("PLACE 2,2", () => {
    const robot: IRobot = {
      direction: Direction.EAST,
      position: { x: 1, y: 1 },
    };

    const newPosition = { x: 2, y: 2 };
    const result = placeRobot(newPosition);
    expect(result).toStrictEqual(newPosition);
  });
});
