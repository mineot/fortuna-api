import type { Kysely } from 'kysely';

import { getDb } from './client';
import { migrations } from './migrations';
import { ensureMigrationsTable } from './migrations-table';
import type { Database } from './schema';

function sortMigrationsAsc() {
  return [...migrations].sort((a, b) => a.version - b.version);
}

function getLatestVersion(): number {
  const sorted = sortMigrationsAsc();
  const latest = sorted.at(-1);
  if (!latest) {
    return 0;
  }

  return latest.version;
}

function findMigrationByVersion(version: number) {
  return migrations.find((migration) => migration.version === version);
}

async function getCurrentVersion(db: Kysely<Database>): Promise<number> {
  const row = await db
    .selectFrom('migrations')
    .select('version')
    .orderBy('version', 'desc')
    .limit(1)
    .executeTakeFirst();

  return row?.version ?? 0;
}

async function getAppliedVersions(db: Kysely<Database>): Promise<Set<number>> {
  const rows = await db.selectFrom('migrations').select('version').execute();
  return new Set(rows.map((row) => row.version));
}

async function applyUpToVersion(
  db: Kysely<Database>,
  appliedVersions: Set<number>,
  targetVersion: number,
): Promise<void> {
  const sorted = sortMigrationsAsc();
  const toApply = sorted.filter(
    (migration) => migration.version <= targetVersion && !appliedVersions.has(migration.version),
  );

  for (const migration of toApply) {
    await db.transaction().execute(async (trx) => {
      await migration.up(trx);
      await trx
        .insertInto('migrations')
        .values({
          version: migration.version,
          name: migration.name,
          executed_at: new Date().toISOString(),
        })
        .execute();
    });
  }
}

async function rollbackToVersion(db: Kysely<Database>, targetVersion: number): Promise<void> {
  const appliedRows = await db
    .selectFrom('migrations')
    .select(['version', 'name'])
    .where('version', '>', targetVersion)
    .orderBy('version', 'desc')
    .execute();

  for (const applied of appliedRows) {
    const migration = findMigrationByVersion(applied.version);

    if (migration) {
      await db.transaction().execute(async (trx) => {
        await migration.down(trx);
        await trx.deleteFrom('migrations').where('version', '=', applied.version).execute();
      });
      continue;
    }

    // If no migration file exists anymore for this applied version, remove only the registry row
    // so the database can auto-sync to the versions currently available in code.
    await db.deleteFrom('migrations').where('version', '=', applied.version).execute();
  }
}

export async function migrateTo(targetVersion: number): Promise<void> {
  if (targetVersion < 0) {
    throw new Error('Target migration version cannot be negative.');
  }

  const latestVersion = getLatestVersion();
  if (targetVersion > latestVersion) {
    throw new Error(
      `Target version ${targetVersion} is higher than the latest available migration version ${latestVersion}.`,
    );
  }

  const db = getDb();
  await ensureMigrationsTable(db);

  const currentVersion = await getCurrentVersion(db);
  if (currentVersion > targetVersion) {
    await rollbackToVersion(db, targetVersion);
  }

  const appliedVersions = await getAppliedVersions(db);
  await applyUpToVersion(db, appliedVersions, targetVersion);
}

export async function migrateToLatest(): Promise<void> {
  await migrateTo(getLatestVersion());
}
