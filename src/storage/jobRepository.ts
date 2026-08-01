import db from "./database";
import { Job } from "../models/Job";
import { JobState } from "../enums/JobState";

export function insertJob(job: Job): void {
    const statement = db.prepare(`
        INSERT INTO jobs (
            id,
            command,
            state,
            attempts,
            max_retries,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    statement.run(
        job.id,
        job.command,
        job.state,
        job.attempts,
        job.maxRetries,
        job.createdAt.toISOString(),
        job.updatedAt.toISOString()
    );
}



export function updateJobState(id: string, state: JobState): void {
    const statement = db.prepare(`
        UPDATE jobs
        SET state = ?, updated_at = ?
        WHERE id = ?
    `);

    statement.run(
        state,
        new Date().toISOString(),
        id
    );
}

export function getNextPendingJob(): Job | undefined {
    const statement = db.prepare(`
        SELECT *
        FROM jobs
        WHERE state = ?
        ORDER BY created_at ASC
        LIMIT 1
    `);

    return statement.get(JobState.Pending) as Job | undefined;
}