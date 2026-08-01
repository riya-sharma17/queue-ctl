import db from "./database";
import { Job } from "../models/Job";

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