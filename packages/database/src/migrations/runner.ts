import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import type { Kysely } from 'kysely';

import { createSqliteKysely } from '../adapters';
import { compareSemver } from './semver';
import { versionedMigrations } from './registry';
import type { MigrationDatabase, MigrationReconcileReport, VersionedMigration } from './types';

const PACKAGE_JSON_URL = new URL('../../../../package.json', import.meta.url);

const sortMigrationsAscending = (
  left: VersionedMigration,
  right: VersionedMigration,
): number => {
  const versionComparison = compareSemver(left.version, right.version);

  if (versionComparison !== 0) {
    return versionComparison;
  }

  return left.id.localeCompare(right.id);
};

const sortMigrationsDescending = (
  left: VersionedMigration,
  right: VersionedMigration,
): number => sortMigrationsAscending(right, left);

const getSortedMigrations = (): VersionedMigration[] => [...versionedMigrations].sort(sortMigrationsAscending);

const readAppVersion = async (): Promise<string> => {
  const packageJsonRaw = await readFile(fileURLToPath(PACKAGE_JSON_URL), 'utf8');
  const packageJson = JSON.parse(packageJsonRaw) as { version?: string };
  const appVersion = packageJson.version?.trim();

  if (!appVersion) {
    throw new Error('Could not resolve app version from root package.json');
  }

  return appVersion;
};

const createMigrationTableIfMissing = async (
  db: Kysely<MigrationDatabase>,
): Promise<void> => {
  await db.schema
    .createTable('migration')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
    .addColumn('migration_id', 'text', (column) => column.notNull().unique())
    .addColumn('version', 'text', (column) => column.notNull())
    .addColumn('applied_at', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createIndex('idx_migration_version')
    .ifNotExists()
    .on('migration')
    .column('version')
    .execute();
};

const getAppliedMigrationIds = async (
  db: Kysely<MigrationDatabase>,
): Promise<Set<string>> => {
  const rows = await db
    .selectFrom('migration')
    .select(['migration_id'])
    .orderBy('id', 'asc')
    .execute();

  return new Set(rows.map((row) => row.migration_id));
};

const assertNoUnknownAppliedMigrations = (
  appliedMigrationIds: Set<string>,
  registryById: Map<string, VersionedMigration>,
): void => {
  for (const migrationId of appliedMigrationIds) {
    if (!registryById.has(migrationId)) {
      throw new Error(
        `Found applied migration "${migrationId}" not present in current registry. Aborting for safety.`,
      );
    }
  }
};

const resolveTargetMigrations = (
  migrations: readonly VersionedMigration[],
  targetVersion: string,
): Set<string> => {
  const targetMigrationIds = migrations
    .filter((migration) => compareSemver(migration.version, targetVersion) <= 0)
    .map((migration) => migration.id);

  return new Set(targetMigrationIds);
};

export interface ReconcileMigrationsOptions {
  targetVersion?: string;
}

export const reconcileMigrations = async (
  options: ReconcileMigrationsOptions = {},
): Promise<MigrationReconcileReport> => {
  const db = createSqliteKysely<MigrationDatabase>();

  try {
    const targetVersion = options.targetVersion ?? (await readAppVersion());
    const sortedMigrations = getSortedMigrations();
    const registryById = new Map(sortedMigrations.map((migration) => [migration.id, migration]));

    await createMigrationTableIfMissing(db);

    const appliedMigrationIds = await getAppliedMigrationIds(db);
    assertNoUnknownAppliedMigrations(appliedMigrationIds, registryById);

    const targetMigrationIds = resolveTargetMigrations(sortedMigrations, targetVersion);

    const migrationsToApply = sortedMigrations.filter(
      (migration) => targetMigrationIds.has(migration.id) && !appliedMigrationIds.has(migration.id),
    );

    const migrationsToRollback = sortedMigrations
      .filter((migration) => appliedMigrationIds.has(migration.id) && !targetMigrationIds.has(migration.id))
      .sort(sortMigrationsDescending);

    const applied: string[] = [];
    const rolledBack: string[] = [];

    for (const migration of migrationsToRollback) {
      await db.transaction().execute(async (trx) => {
        await migration.down(trx);

        await trx.deleteFrom('migration').where('migration_id', '=', migration.id).execute();
      });

      rolledBack.push(migration.id);
    }

    for (const migration of migrationsToApply) {
      await db.transaction().execute(async (trx) => {
        await migration.up(trx);

        await trx
          .insertInto('migration')
          .values({
            migration_id: migration.id,
            version: migration.version,
            applied_at: new Date().toISOString(),
          })
          .execute();
      });

      applied.push(migration.id);
    }

    return {
      targetVersion,
      applied,
      rolledBack,
    };
  } finally {
    await db.destroy();
  }
};

export interface MigrationStatus {
  targetVersion: string;
  pendingUp: string[];
  pendingDown: string[];
  applied: string[];
}

export const getMigrationStatus = async (
  options: ReconcileMigrationsOptions = {},
): Promise<MigrationStatus> => {
  const db = createSqliteKysely<MigrationDatabase>();

  try {
    const targetVersion = options.targetVersion ?? (await readAppVersion());
    const sortedMigrations = getSortedMigrations();
    const registryById = new Map(sortedMigrations.map((migration) => [migration.id, migration]));

    await createMigrationTableIfMissing(db);

    const appliedMigrationIds = await getAppliedMigrationIds(db);
    assertNoUnknownAppliedMigrations(appliedMigrationIds, registryById);

    const targetMigrationIds = resolveTargetMigrations(sortedMigrations, targetVersion);

    const pendingUp = sortedMigrations
      .filter((migration) => targetMigrationIds.has(migration.id) && !appliedMigrationIds.has(migration.id))
      .map((migration) => migration.id);

    const pendingDown = sortedMigrations
      .filter((migration) => appliedMigrationIds.has(migration.id) && !targetMigrationIds.has(migration.id))
      .sort(sortMigrationsDescending)
      .map((migration) => migration.id);

    const applied = sortedMigrations
      .filter((migration) => appliedMigrationIds.has(migration.id))
      .map((migration) => migration.id);

    return {
      targetVersion,
      pendingUp,
      pendingDown,
      applied,
    };
  } finally {
    await db.destroy();
  }
};
