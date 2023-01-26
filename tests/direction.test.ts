import { turnRobotTo } from "../src/board";
import { Direction } from "../src/common";

describe("DIRECTION tests", () => {
  test("NORTH", () => {
    expect(turnRobotTo(Direction.NORTH)).toStrictEqual(Direction.NORTH);
  });

  test("SOUTH", () => {
    expect(turnRobotTo(Direction.SOUTH)).toStrictEqual(Direction.SOUTH);
  });

  test("EAST", () => {
    expect(turnRobotTo(Direction.EAST)).toStrictEqual(Direction.EAST);
  });

  test("WEST", () => {
    expect(turnRobotTo(Direction.WEST)).toStrictEqual(Direction.WEST);
  });
});
