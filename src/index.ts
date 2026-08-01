import { Command } from "commander";
import { registerEnqueueCommand } from "./cli/enqueue";

const program = new Command();

program.name("my-cli")
.description("A simple CLI tool")
.version("1.0.0");

registerEnqueueCommand(program);

program.parse();