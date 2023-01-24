import dotenv from "dotenv";
import process from "process";
import readline from "readline/promises";

import { initBoard } from "./board";
import { Command } from "./common";
import { initController, parseCommands } from "./controller";
import RedisConnector from "./redisConnector";

dotenv.config();

const boardKey = process.env.REDIS_FEEDBACK_KEY;
if (!boardKey) {
  throw new Error("REDIS_KEY undefined");
}

(async () => {
  const connector = new RedisConnector("Board subscriber - main");
  await Promise.all([initBoard(), connector.connect(), initController()]);

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
        console.log("Command required");
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
  reader.on("close", async () => {
    console.log("Closing controller");
    await connector.disconnect();
    process.exit(0);
  });
  reader.on("SIGINT", async () => {
    console.log("SIGINT signal received");
    // await connector.disconnect();
    reader.close();
  });

  await connector.redis.subscribe(boardKey, (message: string) => {
    console.log(message);
    reader.prompt();
  });
})();

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  process.exit(0);
});
