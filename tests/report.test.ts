import { robotStatus } from "../src/board";
import { Direction, IRobot } from "../src/common";

describe("REPORT tests", () => {
  test("Show correct state", () => {
    const robot: IRobot = {
      direction: Direction.NORTH,
      position: { x: 2, y: 2 },
    };

    const result = robotStatus(robot);
    expect(result).toStrictEqual(robot);
  });
});
