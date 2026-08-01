import { Command } from "commander";
import { registerEnqueueCommand } from "./cli/enqueue";
import { registerWorkerCommand } from "./cli/worker";
import { registerStatusCommand } from "./cli/status";
import { registerListCommand } from "./cli/list";
import { registerDlqCommand } from "./cli/dlq";
import { registerConfigCommand } from "./cli/config";

const program = new Command();

program
    .name("my-cli")
    .description("A simple CLI tool")
    .version("1.0.0");

registerEnqueueCommand(program);
registerWorkerCommand(program);
registerStatusCommand(program);
registerListCommand(program);
registerDlqCommand(program);
registerConfigCommand(program);

program.parse();