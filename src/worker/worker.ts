import { execa } from "execa";
import {
    getNextPendingJob,
    updateJobState,
} from "../storage/jobRepository";
import { JobState } from "../enums/JobState";

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
        updateJobState(job.id, JobState.Failed);

        console.error("Job execution failed.");
        console.error(error);
    }
}