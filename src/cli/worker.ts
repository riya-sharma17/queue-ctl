import { Command } from "commander";
import { startWorker } from "../worker/worker";

export function registerWorkerCommand(program: Command) {
    program
        .command("worker")
        .description("Start the job worker")
        .action(() => {
            startWorker();
        });
}