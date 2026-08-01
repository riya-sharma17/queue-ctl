import { Command } from "commander";
import { Job } from "../models/Job";
import { JobState } from "../enums/JobState";
import { insertJob } from "../storage/jobRepository"
    ;

export function registerEnqueueCommand(program: Command) {
    program
        .command("enqueue")
        .description("Add a new job to the queue")
        .requiredOption("--id <id>", "Unique Job ID")
        .requiredOption("--command <command>", "Command to execute")
        .action((options) => {

            const job: Job = {
                id: options.id,
                command: options.command,
                state: JobState.Pending,
                attempts: 0,
                maxRetries: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            insertJob(job);

            console.log("✅ Job added successfully!");
        });
}