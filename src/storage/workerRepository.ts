import db from "./database";

export function registerWorker(id: string, pid: number): void {

    const statement = db.prepare(`
        INSERT INTO workers (
            id,
            pid,
            status,
            started_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    statement.run(
        id,
        pid,
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

export function stopAllWorkers(): void {

    const statement = db.prepare(`
        UPDATE workers
        SET
            status = 'stopped',
            updated_at = ?
        WHERE status = 'active'
    `);

    statement.run(new Date().toISOString());

}

export function isWorkerActive(id: string): boolean {

    const statement = db.prepare(`
        SELECT status
        FROM workers
        WHERE id = ?
    `);

    const row = statement.get(id) as
        | { status: string }
        | undefined;

    return row?.status === "active";
}