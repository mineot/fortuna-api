import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';

import { FileMigrationProvider, Migrator } from 'kysely';

import { createSqliteDatabase, destroySqliteDatabase } from '../adapters/sqlite';
import type { DatabaseClient } from '../client';

export type MigrationCommand = 'latest' | 'up' | 'down';

export interface RunMigrationsOptions {
  dbFilePath?: string;
  migrationFolder?: string;
}

const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);
const CURRENT_DIR_PATH = dirname(CURRENT_FILE_PATH);

const DEFAULT_DB_FILE_PATH = join(process.cwd(), 'data', 'fortuna.sqlite');
const DEFAULT_MIGRATIONS_FOLDER = join(CURRENT_DIR_PATH, 'sqlite');

const resolveCommand = (input: string | undefined): MigrationCommand => {
  if (input === 'up' || input === 'down' || input === 'latest' || input === undefined) {
    return input ?? 'latest';
  }

  throw new Error(`Invalid migration command: ${input}. Use one of: latest, up, down.`);
};

const printResults = (command: MigrationCommand, migrationResults: unknown): void => {
  const results = Array.isArray(migrationResults) ? migrationResults : [];

  if (results.length === 0) {
    console.info(`[database:migrate] No migrations executed for command: ${command}`);
    return;
  }

  for (const result of results as Array<{ migrationName: string; status: string }>) {
    console.info(`[database:migrate] ${result.migrationName}: ${result.status}`);
  }
};

export const createMigrator = (
  db: DatabaseClient,
  migrationFolder: string = DEFAULT_MIGRATIONS_FOLDER,
): Migrator =>
  new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

export const runMigrations = async (
  command: MigrationCommand = 'latest',
  options: RunMigrationsOptions = {},
): Promise<void> => {
  const dbFilePath = options.dbFilePath ?? DEFAULT_DB_FILE_PATH;
  const migrationFolder = options.migrationFolder ?? DEFAULT_MIGRATIONS_FOLDER;

  await mkdir(dirname(dbFilePath), { recursive: true });

  const db = createSqliteDatabase({ filename: dbFilePath });

  try {
    const migrator = createMigrator(db, migrationFolder);

    const migrationResponse =
      command === 'up'
        ? await migrator.migrateUp()
        : command === 'down'
          ? await migrator.migrateDown()
          : await migrator.migrateToLatest();

    if (migrationResponse.error) {
      throw migrationResponse.error;
    }

    printResults(command, migrationResponse.results);
  } finally {
    await destroySqliteDatabase(db);
  }
};

const runCli = async (): Promise<void> => {
  const command = resolveCommand(process.argv[2]);
  const dbFilePathArg = process.argv[3];
  const options: RunMigrationsOptions = {};

  if (dbFilePathArg !== undefined) {
    options.dbFilePath = dbFilePathArg;
  }

  await runMigrations(command, options);
};

if (process.argv[1] === CURRENT_FILE_PATH) {
  await runCli();
}
