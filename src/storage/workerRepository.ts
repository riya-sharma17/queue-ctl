import db from "./database";

export function registerWorker(id: string): void {

    const statement = db.prepare(`
        INSERT INTO workers (
            id,
            status,
            started_at,
            updated_at
        )
        VALUES (?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    statement.run(
        id,
        "active",
        now,
        now
    );
}

export function stopWorker(id: string): void {

    const statement = db.prepare(`
        UPDATE workers
        SET status = ?, updated_at = ?
        WHERE id = ?
    `);

    statement.run(
        "stopped",
        new Date().toISOString(),
        id
    );
}

export function getActiveWorkerCount(): number {

    const statement = db.prepare(`
        SELECT COUNT(*) as count
        FROM workers
        WHERE status = 'active'
    `);

    const result = statement.get() as { count: number };

    return result.count;
}