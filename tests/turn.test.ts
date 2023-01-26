import { turnRobotLeft, turnRobotRight } from "../src/board";
import { Direction, IRobot } from "../src/common";

describe("LEFT/RIGHT tests", () => {
  let robot: IRobot;

  beforeEach(() => {
    robot = {
      direction: Direction.EAST,
      position: { x: 1, y: 1 },
    };
  });

  test("Turn LEFT", () => {
    const direction = turnRobotLeft(Direction.NORTH);
    expect(direction).toStrictEqual(Direction.WEST);
  });

  test("Turn RIGHT", () => {
    const direction = turnRobotRight(Direction.NORTH);
    expect(direction).toStrictEqual(Direction.EAST);
  });
});