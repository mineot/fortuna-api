import { migrations } from '@/database/migrations';
import Database from 'better-sqlite3';
import path from 'node:path';

export type DB = Database.Database;

function getDbPath() {
  return path.resolve(process.cwd(), 'dev.db');
}

function ensureMigrationsTable(db: DB) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      version     INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      applied_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function getAppliedVersions(db: DB): Set<number> {
  ensureMigrationsTable(db);
  const rows = db.prepare(`SELECT version FROM migrations ORDER BY version`).all() as Array<{
    version: number;
  }>;
  return new Set(rows.map((r) => r.version));
}

function applyMigrations(db: DB) {
  const ordered = [...migrations].sort((a, b) => a.version - b.version);

  const versions = new Set<number>();

  for (const m of ordered) {
    if (versions.has(m.version)) {
      throw new Error(`Migration version duplicated: ${m.version}`);
    }
    versions.add(m.version);
  }

  const applied = getAppliedVersions(db);

  for (const m of ordered) {
    if (applied.has(m.version)) continue;

    const tx = db.transaction(() => {
      for (const sql of m.statements) {
        db.exec(sql);
      }

      db.prepare(`INSERT INTO migrations (version, name) VALUES (?, ?)`).run(m.version, m.name);
    });

    tx();
  }
}

export function initDb(): DB {
  const dbPath = getDbPath();
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  applyMigrations(db);
  return db;
}
