import { Command } from "commander";
import { startWorker } from "../worker/worker";

export function registerWorkerCommand(program: Command): void {

    program
        .command("worker")
        .description("Start a worker")
        .action(async () => {
            await startWorker();
        });

}