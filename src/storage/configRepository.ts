import db from "./database";

export function getConfig(key: string): string {

    const statement = db.prepare(`
        SELECT value
        FROM config
        WHERE key = ?
    `);

    const row = statement.get(key) as { value: string } | undefined;

    if (!row) {
        throw new Error(`Configuration '${key}' not found.`);
    }

    return row.value;
}

export function setConfig(key: string, value: string): void {

    const statement = db.prepare(`
        UPDATE config
        SET value = ?
        WHERE key = ?
    `);

    statement.run(value, key);
}