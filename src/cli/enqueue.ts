import { Command } from "commander";
import { Job } from "../models/Job";
import { JobState } from "../enums/JobState";
import { insertJob } from "../storage/jobRepository";
import { getConfig } from "../storage/configRepository";

export function registerEnqueueCommand(program: Command) {

    program
        .command("enqueue")
        .description("Add a new job to the queue")
        .requiredOption("--id <id>", "Unique Job ID")
        .requiredOption("--command <command>", "Command to execute")
         .option(
            "--priority <priority>",
            "Job priority (1 = highest, 5 = lowest)",
            "5"
        )
        .action((options) => {

            try {
                const job: Job = {
                    id: options.id,
                    command: options.command,
                    state: JobState.Pending,
                    attempts: 0,
                    maxRetries: Number(getConfig("max_retries")),
                    priority: Number(options.priority),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                insertJob(job);

                console.log("Job added successfully!");
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);

                if (message.includes("UNIQUE constraint failed: jobs.id")) {
                    console.error(`Job with id \"${options.id}\" already exists.`);
                    process.exitCode = 1;
                    return;
                }

                console.error(`Failed to enqueue job: ${message}`);
                process.exitCode = 1;
            }
        });

}