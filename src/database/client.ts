import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import DatabaseDriver from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';

import type { Database } from './schema';

export interface DatabaseConfig {
  filename?: string;
}

function resolveDefaultFilename(): string {
  if (process.env.NODE_ENV === 'dev') {
    return path.join(process.cwd(), 'dev.db');
  }

  const productionDir = path.join(os.homedir(), '.fortuna');
  mkdirSync(productionDir, { recursive: true });
  return path.join(productionDir, 'fortuna.db');
}

export function createDatabase(config?: DatabaseConfig): Kysely<Database> {
  const filename = config?.filename ?? resolveDefaultFilename();

  return new Kysely<Database>({
    dialect: new SqliteDialect({
      database: new DatabaseDriver(filename),
    }),
  });
}

let dbInstance: Kysely<Database> | null = null;

export function getDb(): Kysely<Database> {
  if (!dbInstance) {
    dbInstance = createDatabase();
  }

  return dbInstance;
}

export async function destroyDb(): Promise<void> {
  if (!dbInstance) {
    return;
  }

  await dbInstance.destroy();
  dbInstance = null;
}
