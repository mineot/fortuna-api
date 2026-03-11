import { getDatabasePath } from './core/path';
import { Kysely, SqliteDialect } from 'kysely';
import { runMigrator } from './core/migrator';
import SQLite from 'better-sqlite3';
import type { DatabaseSchema } from './core/schema';

let databaseInstance: Kysely<DatabaseSchema> | null = null;
let databaseInitPromise: Promise<Kysely<DatabaseSchema>> | null = null;

function createDatabase(): Kysely<DatabaseSchema> {
  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new SQLite(getDatabasePath()),
    }),
  });
}

export async function initDatabase(): Promise<Kysely<DatabaseSchema>> {
  if (databaseInstance) {
    return databaseInstance;
  }

  if (databaseInitPromise) {
    return databaseInitPromise;
  }

  databaseInitPromise = (async () => {
    const database = createDatabase();

    try {
      await runMigrator(database);
      databaseInstance = database;
      return database;
    } catch (error) {
      await database.destroy().catch(() => undefined);
      throw error;
    } finally {
      databaseInitPromise = null;
    }
  })();

  return databaseInitPromise;
}

export function getDatabase(): Kysely<DatabaseSchema> {
  if (!databaseInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }

  return databaseInstance;
}

export async function closeDatabase(): Promise<void> {
  if (!databaseInstance) {
    return;
  }

  await databaseInstance.destroy();
  databaseInstance = null;
}
