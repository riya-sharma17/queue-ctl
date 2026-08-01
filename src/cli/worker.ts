import { Command } from "commander";
import { spawn } from "child_process";
import { startWorker } from "../worker/worker";

export function registerWorkerCommand(program: Command): void {

    const worker = program
        .command("worker")
        .description("Worker commands");

    worker
        .command("start")
        .description("Start one or more workers")
        .option("--count <count>", "Number of workers", "1")
        .action(async (options) => {

            const count = Number(options.count);

            if (count === 1) {
                await startWorker();
                return;
            }

            for (let i = 0; i < count; i++) {

                spawn(
                    process.execPath,
                    [
                        "node_modules/ts-node/dist/bin.js",
                        "src/index.ts",
                        "worker",
                        "start"
                    ],
                    {
                        stdio: "inherit",
                    }
                );

            }

        });

}