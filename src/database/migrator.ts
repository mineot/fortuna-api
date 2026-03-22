import { getDatabase } from './db';
import { Kysely } from 'kysely';
import type { Database } from './schema';

import { migration0001Init } from './migrations/0001_init';

export const version = 1;

export interface MigrationDefinition {
  name: string;
  version: number;
  up: (db: Kysely<Database>) => Promise<void>;
  down: (db: Kysely<Database>) => Promise<void>;
}

const migrations: MigrationDefinition[] = [migration0001Init].sort((a, b) => a.version - b.version);

function getNow(): string {
  return new Date().toISOString();
}

async function ensureMigrationsTable(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('migrations')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('version', 'integer', (column) => column.notNull().unique())
    .addColumn('executed_at', 'text', (column) => column.notNull())
    .execute();
}

async function getCurrentVersion(db: Kysely<Database>): Promise<number> {
  await ensureMigrationsTable(db);

  const lastMigration = await db
    .selectFrom('migrations')
    .select(['version'])
    .orderBy('version', 'desc')
    .limit(1)
    .executeTakeFirst();

  return lastMigration?.version ?? 0;
}

function getUpMigrations(fromVersion: number, toVersion: number): MigrationDefinition[] {
  return migrations.filter(
    (migration) => migration.version > fromVersion && migration.version <= toVersion,
  );
}

function getDownMigrations(fromVersion: number, toVersion: number): MigrationDefinition[] {
  return migrations
    .filter((migration) => migration.version <= fromVersion && migration.version > toVersion)
    .sort((a, b) => b.version - a.version);
}

async function registerMigration(
  db: Kysely<Database>,
  migration: MigrationDefinition,
): Promise<void> {
  await db
    .insertInto('migrations')
    .values({
      name: migration.name,
      version: migration.version,
      executed_at: getNow(),
    })
    .execute();
}

async function unregisterMigration(
  db: Kysely<Database>,
  migration: MigrationDefinition,
): Promise<void> {
  await db.deleteFrom('migrations').where('version', '=', migration.version).execute();
}

async function applyUpMigrations(
  db: Kysely<Database>,
  fromVersion: number,
  toVersion: number,
): Promise<void> {
  const pendingMigrations = getUpMigrations(fromVersion, toVersion);

  for (const migration of pendingMigrations) {
    await db.transaction().execute(async (trx) => {
      await migration.up(trx);
      await registerMigration(trx, migration);
    });
  }
}

async function applyDownMigrations(
  db: Kysely<Database>,
  fromVersion: number,
  toVersion: number,
): Promise<void> {
  const rollbackMigrations = getDownMigrations(fromVersion, toVersion);

  for (const migration of rollbackMigrations) {
    await db.transaction().execute(async (trx) => {
      await migration.down(trx);
      await unregisterMigration(trx, migration);
    });
  }
}

function validateVersions(): void {
  const versions = migrations.map((migration) => migration.version);
  const uniqueVersions = new Set(versions);

  if (versions.length !== uniqueVersions.size) {
    throw new Error('Duplicate migration versions detected.');
  }

  const names = migrations.map((migration) => migration.name);
  const uniqueNames = new Set(names);

  if (names.length !== uniqueNames.size) {
    throw new Error('Duplicate migration names detected.');
  }
}

export async function migrateDatabase(): Promise<void> {
  validateVersions();

  const db = getDatabase();
  const currentVersion = await getCurrentVersion(db);

  if (currentVersion === version) {
    return;
  }

  if (currentVersion < version) {
    await applyUpMigrations(db, currentVersion, version);
    return;
  }

  await applyDownMigrations(db, currentVersion, version);
}
