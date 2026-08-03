import { Command } from "commander";
import { getAllJobs } from "../storage/jobRepository";

export function registerListCommand(program: Command) {

    program
        .command("list")
        .description("List jobs")
        .option("--state <state>", "Filter by state")
        .action((options) => {

            const jobs = getAllJobs(options.state);

            if (jobs.length === 0) {
                console.log("No jobs found.");
                return;
            }

            console.log("----------------------------------------------------------------------------");
            console.log("ID\tSTATE\t\tPRIORITY\tATTEMPTS\tCOMMAND");
            console.log("----------------------------------------------------------------------------");

            jobs.forEach((job) => {
                console.log(
                    `${job.id}\t${job.state}\t\t${job.priority}\t\t${job.attempts}\t\t${job.command}`
                );
            });

            console.log("----------------------------------------------------------------------------");

        });

}