import process from "process";
import readline from "readline/promises";

import { initBoard } from "./board";
import { Command } from "./common";
import { initController, parseCommands } from "./controller";
import { connect } from "./redisConnector";

(async () => {
  await Promise.all([initBoard(), initController(), connect()]);

  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "controller> ",
  });
  reader.prompt();

  reader.on("line", (line) => {
    const commands = line.trim().toUpperCase().split(" ");
    const command = commands[0];
    switch (command) {
      case "HELO":
        console.log("HELO received");
        break;
      case "QUIT":
        reader.close();
        break;
      case "":
        console.error("Command required");
        break;
      default:
        // is command a valid command?
        if (!Object.keys(Command).includes(command)) {
          console.log("Unknown command");
          break;
        }
        // valid command at this point
        try {
          parseCommands(commands);
        } catch (error) {
          console.log("Catching error");
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log(error);
          }
        }
        break;
    }
    reader.prompt();
  });
  reader.on("close", () => {
    console.log("Closing controller");
    process.exit(0);
  });
  reader.on("SIGINT", () => {
    console.log("SIGINT signal received");
    reader.close();
  });
})();

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  process.exit(0);
});
