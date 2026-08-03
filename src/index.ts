import { Command } from "commander";
import { registerEnqueueCommand } from "./cli/enqueue";
import { registerWorkerCommand } from "./cli/worker";
import { registerStatusCommand } from "./cli/status";
import { registerListCommand } from "./cli/list";
import { registerDlqCommand } from "./cli/dlq";
import { registerConfigCommand } from "./cli/config";
import { registerMetricsCommand } from "./cli/metrics";

const program = new Command();

function handleCliError(error: unknown): void {
    if (error instanceof Error && error.name === "CommanderError") {
        process.exitCode = 1;
        return;
    }

    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(String(error));
    }

    process.exitCode = 1;
}

process.on("uncaughtException", handleCliError);
process.on("unhandledRejection", handleCliError);

program
    .name("queuectl")
    .description("Persistent Job Queue CLI with workers, retries, and DLQ")
    .version("1.0.0");

program.exitOverride();
program.showHelpAfterError();

registerEnqueueCommand(program);
registerWorkerCommand(program);
registerStatusCommand(program);
registerListCommand(program);
registerDlqCommand(program);
registerConfigCommand(program);
registerMetricsCommand(program);

void program.parseAsync(process.argv).catch(handleCliError);