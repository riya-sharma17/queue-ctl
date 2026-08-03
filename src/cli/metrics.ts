import { Command } from "commander";
import {
    getAverageRetries,
    getJobCounts,
} from "../storage/jobRepository";
import { getActiveWorkerCount } from "../storage/workerRepository";

export function registerMetricsCommand(program: Command): void {

    program
        .command("metrics")
        .description("Show queue metrics")
        .action(() => {

            const counts = getJobCounts();
            const activeWorkers = getActiveWorkerCount();

            const total = counts.total ?? 0;
            const completed = counts.completed ?? 0;
            const dead = counts.dead ?? 0;

            const successRate =
                total === 0
                    ? 0
                    : (completed / total) * 100;

            const failureRate =
                total === 0
                    ? 0
                    : (dead / total) * 100;

            const averageRetries = getAverageRetries();

            let health = "🟢 Healthy";

            if (failureRate >= 10 && failureRate < 30) {
                health = "🟡 Warning";
            }

            if (failureRate >= 30) {
                health = "🔴 Critical";
            }

            console.log("======================================");
            console.log("          📊 Queue Metrics");
            console.log("======================================");

            console.log(` Total Jobs        : ${total}`);
            console.log(` Completed Jobs    : ${completed}`);
            console.log(` Pending Jobs      : ${counts.pending ?? 0}`);
            console.log(` Processing Jobs   : ${counts.processing ?? 0}`);
            console.log(` Dead Jobs         : ${dead}`);

            console.log("--------------------------------------");

            console.log(` Success Rate      : ${successRate.toFixed(2)}%`);
            console.log(` Failure Rate      : ${failureRate.toFixed(2)}%`);
            console.log(` Average Retries   : ${averageRetries.toFixed(2)}`);

            console.log("--------------------------------------");

            console.log(` Active Workers    : ${activeWorkers}`);
            console.log(` Queue Health      : ${health}`);

            console.log("======================================");

        });

}