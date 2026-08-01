import { execa } from "execa";
import {
    getNextPendingJob,
    updateAttempts,
    updateJobState,
} from "../storage/jobRepository";
import { JobState } from "../enums/JobState";
import { sleep } from "../utils/sleep";

export async function startWorker(): Promise<void> {
    console.log("Worker started...");

    const job = getNextPendingJob();

    if (!job) {
        console.log("No pending jobs found.");
        return;
    }

    updateJobState(job.id, JobState.Processing);
    console.log("Job state updated to PROCESSING");

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

            const delay = Math.pow(2, attempts) * 1000;

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