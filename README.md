# Robot demo

## Requirements

You are required to simulate a toy robot moving on a square tabletop, of dimensions 5 units x 5 units.
There are no other obstructions on the table surface. The robot is free to roam around the surface of the table, but must be prevented from falling to destruction.  
Any movement that would result in the robot falling from the table must be prevented, however further valid movement commands must still be allowed.  
All commands should be discarded until a valid place command has been executed.

## Implementation and Setup
### Redis
This demo requires a running instance of Redis to allow communication between the console and the board/robot.

### Environment
This demo requires an `.env` file, a sample of which is provided below.

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_KEY=robot
REDIS_FEEDBACK_KEY=board
BOARD_WIDTH=10
BOARD_HEIGHT=10
```

Update the REDIS keys according to where and how Redis is running.

After the demo has been cloned from the repository, the `npm` modeules should be installed:  

    yarn install
## Running the demo
Build the demo by running:  

    yarn build
    node dist/index.js

The robot is at position (1, 1) when the demo starts which is at the bottom left corner of the board.North is top, south is down, east is right and west is left on the sides of the board.

Valid commands to control the robot are:

    PLACE x,y
Moves the robot to a new position on the board.

    DIRECTION NORTH|SOUTH|EAST|WEST  
Turns the robot to a new direction.

    MOVE
Moves the robot forward one space depending on the the direction that the robot is facing.

    LEFT
Turns the robot to the left.

    RIGHT
Turns the robot to the right.

    REPORT
Outputs the robot's location on the board and direction it is facing.

    RETREAT
The robot moves backwards one space while keeping the direction.

    QUIT
Terminates the demo and returns control to the OS.




