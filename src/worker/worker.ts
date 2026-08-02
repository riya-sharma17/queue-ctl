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
    isWorkerActive,
} from "../storage/workerRepository";
import { getConfig } from "../storage/configRepository";

export async function startWorker(): Promise<void> {

    const workerId = `worker-${process.pid}`;

    registerWorker(workerId, process.pid);

    console.log(`${workerId} started...`);

    process.on("SIGINT", () => {

        console.log(`Stopping ${workerId}...`);

        stopWorker(workerId);

    });

    while (true) {

        if (!isWorkerActive(workerId)) {

            console.log(`${workerId} stopped.`);

            return;
        }

        const job = claimNextJob();

        if (!job) {

            await sleep(2000);
            continue;
        }

        console.log("Job found:");
        console.log(job);

        let attempts = job.attempts;

        while (attempts < job.maxRetries) {

            try {

                await execa(job.command, {
                    shell: true,
                });

                updateJobState(job.id, JobState.Completed);

                console.log("Job state updated to COMPLETED");
                console.log("Job executed successfully.");

                break;

            } catch (error) {

                attempts++;

                updateAttempts(job.id, attempts);

                console.error("Job execution failed.");
                console.error(error);

                if (attempts >= job.maxRetries) {

                    updateJobState(job.id, JobState.Dead);

                    console.log("Maximum retries reached.");
                    console.log("Moving job to Dead Letter Queue.");

                    break;
                }

                const base = Number(getConfig("backoff_base"));

                const delay = Math.pow(base, attempts) * 1000;

                console.log(
                    `Waiting ${delay / 1000} seconds before retry...`
                );

                await sleep(delay);

                console.log(
                    `Retrying... Attempt ${attempts + 1}/${job.maxRetries}`
                );
            }
        }

        if (!isWorkerActive(workerId)) {

            console.log(`${workerId} stopped.`);

            return;
        }
    }
}