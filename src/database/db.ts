import { getDatabasePath } from './path';
import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import type { Database as DatabaseSchema } from './schemas';

let db: Kysely<DatabaseSchema> | null = null;

export function getDatabase(): Kysely<DatabaseSchema> {
  if (db) {
    return db;
  }

  const databasePath = getDatabasePath();
  const sqlite = new Database(databasePath);

  db = new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: sqlite,
    }),
  });

  return db;
}
