import { execa } from "execa";
import {
    claimNextJob,
    updateAttempts,
    updateJobState,
} from "../storage/jobRepository";
import { JobState } from "../enums/JobState";
import { sleep } from "../utils/sleep";
import {
    registerWorker,
    stopWorker,
} from "../storage/workerRepository";
import { getConfig } from "../storage/configRepository";

export async function startWorker(): Promise<void> {

    const workerId = `worker-${process.pid}`;

    registerWorker(workerId, process.pid);

    console.log(`${workerId} started...`);

    process.on("SIGINT", () => {

        console.log(`Stopping ${workerId}...`);

        stopWorker(workerId);

        console.log(`${workerId} stopped.`);

        process.exit(0);
    });

    while (true) {

        const job = claimNextJob();

        if (!job) {
            await sleep(2000);
            continue;
        }

        console.log("Job found:");
        console.log(job);

        try {

            await execa(job.command, {
                shell: true,
            });

            updateJobState(job.id, JobState.Completed);

            console.log("Job state updated to COMPLETED");
            console.log("Job executed successfully.");

        } catch (error) {

            const attempts = job.attempts + 1;

            updateAttempts(job.id, attempts);

            if (attempts < job.maxRetries) {

                const base = Number(getConfig("backoff_base"));

                const delay = Math.pow(base, attempts) * 1000;

                console.log(
                    `Waiting ${delay / 1000} seconds before retry...`
                );

                await sleep(delay);

                updateJobState(job.id, JobState.Pending);

                console.log(
                    `Retrying... Attempt ${attempts}/${job.maxRetries}`
                );

            } else {

                updateJobState(job.id, JobState.Dead);

                console.log("Maximum retries reached.");
                console.log("Moving job to Dead Letter Queue.");
            }

            console.error("Job execution failed.");
            console.error(error);
        }
    }
}