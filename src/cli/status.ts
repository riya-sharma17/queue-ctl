import { Command } from "commander";
import { getJobCounts } from "../storage/jobRepository";
import { getActiveWorkerCount } from "../storage/workerRepository";

export function registerStatusCommand(program: Command) {

    program
        .command("status")
        .description("Show queue summary")
        .action(() => {

            const counts = getJobCounts();
            const activeWorkers = getActiveWorkerCount();

            console.log("==================================");
            console.log("         Queue Status");
            console.log("==================================");
            console.log(`Total Jobs      : ${counts.total ?? 0}`);
            console.log(`Pending         : ${counts.pending ?? 0}`);
            console.log(`Processing      : ${counts.processing ?? 0}`);
            console.log(`Completed       : ${counts.completed ?? 0}`);
            console.log(`Dead            : ${counts.dead ?? 0}`);
            console.log(`Active Workers  : ${activeWorkers}`);
            console.log("==================================");

        });

}