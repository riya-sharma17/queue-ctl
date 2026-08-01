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


export function updateAttempts(id: string, attempts: number): void {
    const statement = db.prepare(`
        UPDATE jobs
        SET attempts = ?, updated_at = ?
        WHERE id = ?
    `);

    statement.run(
        attempts,
        new Date().toISOString(),
        id
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

    const row = statement.get(JobState.Pending) as any;

    if (!row) {
        return undefined;
    }

    return {
        id: row.id,
        command: row.command,
        state: row.state,
        attempts: row.attempts,
        maxRetries: row.max_retries,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}