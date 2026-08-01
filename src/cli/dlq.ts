import { Command } from "commander";
import {
    getDeadJobs,
    retryDeadJob,
} from "../storage/jobRepository";

export function registerDlqCommand(program: Command): void {

    const dlq = program
        .command("dlq")
        .description("Dead Letter Queue commands");

    dlq
        .command("list")
        .description("List all dead jobs")
        .action(() => {

            const jobs = getDeadJobs();

            if (jobs.length === 0) {
                console.log("No dead jobs found.");
                return;
            }

            console.log("------------------------------------------------------------");
            console.log("ID\tATTEMPTS\tCOMMAND");
            console.log("------------------------------------------------------------");

            jobs.forEach((job) => {
                console.log(
                    `${job.id}\t${job.attempts}\t\t${job.command}`
                );
            });

            console.log("------------------------------------------------------------");

        });

    dlq
        .command("retry <jobId>")
        .description("Retry a dead job")
        .action((jobId: string) => {

            const success = retryDeadJob(jobId);

            if (success) {
                console.log(`Job ${jobId} moved back to pending.`);
            } else {
                console.log("Job not found or is not in DLQ.");
            }

        });

}