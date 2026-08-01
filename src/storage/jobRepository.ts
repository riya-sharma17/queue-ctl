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

export function claimNextJob(): Job | undefined {

    const transaction = db.transaction(() => {

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

        db.prepare(`
            UPDATE jobs
            SET state = ?, updated_at = ?
            WHERE id = ?
        `).run(
            JobState.Processing,
            new Date().toISOString(),
            row.id
        );

        return {
            id: row.id,
            command: row.command,
            state: JobState.Processing,
            attempts: row.attempts,
            maxRetries: row.max_retries,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        } as Job;

    });

    return transaction();
}

export function getJobCounts() {

    const statement = db.prepare(`
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN state = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN state = 'processing' THEN 1 ELSE 0 END) as processing,
            SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN state = 'dead' THEN 1 ELSE 0 END) as dead
        FROM jobs
    `);

    return statement.get() as {
        total: number;
        pending: number;
        processing: number;
        completed: number;
        dead: number;
    };
}

export function getAllJobs(state?: string): Job[] {

    let rows: any[];

    if (state) {

        const statement = db.prepare(`
            SELECT *
            FROM jobs
            WHERE state = ?
            ORDER BY created_at ASC
        `);

        rows = statement.all(state) as any[];

    } else {

        const statement = db.prepare(`
            SELECT *
            FROM jobs
            ORDER BY created_at ASC
        `);

        rows = statement.all() as any[];
    }

    return rows.map((row) => ({
        id: row.id,
        command: row.command,
        state: row.state,
        attempts: row.attempts,
        maxRetries: row.max_retries,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    }));
}