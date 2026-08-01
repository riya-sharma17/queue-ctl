import Database from "better-sqlite3";

const db = new Database("queue.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        command TEXT NOT NULL,
        state TEXT NOT NULL,
        attempts INTEGER NOT NULL,
        max_retries INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        started_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
`);

db.prepare(`
    INSERT OR IGNORE INTO config (key, value)
    VALUES (?, ?)
`).run("max_retries", "3");

db.prepare(`
    INSERT OR IGNORE INTO config (key, value)
    VALUES (?, ?)
`).run("backoff_base", "2");

export default db;