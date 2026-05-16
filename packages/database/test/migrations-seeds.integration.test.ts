import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';

import type { Database as FortunaDatabase } from '@repo/shared';

import { createSqliteKysely } from '../src/adapters';
import { getMigrationStatus, reconcileMigrations } from '../src/migrations/runner';
import type { MigrationDatabase } from '../src/migrations/types';
import { createUsersRepository, runSeeds } from '../src';

const createdDatabasePaths: string[] = [];

const createTempDatabasePath = (suffix: string): string => {
  const path = join(tmpdir(), `fortuna-${suffix}-${Date.now()}-${Math.random().toString(16).slice(2)}.db`);
  createdDatabasePaths.push(path);

  return path;
};

after(() => {
  for (const path of createdDatabasePaths) {
    rmSync(path, { force: true });
  }
});

describe('Migrations and seeds finalization', () => {
  it('should support upgrade, idempotent rerun, downgrade and re-upgrade', async () => {
    const databaseUrl = createTempDatabasePath('migrations-versioning');

    const initialStatus = await getMigrationStatus({
      databaseUrl,
      targetVersion: '0.1.0',
    });

    assert.deepEqual(initialStatus.applied, []);
    assert.deepEqual(initialStatus.pendingUp, ['001_users_user_settings']);

    const firstUp = await reconcileMigrations({ databaseUrl, targetVersion: '0.1.0' });
    assert.deepEqual(firstUp.applied, ['001_users_user_settings']);
    assert.deepEqual(firstUp.rolledBack, []);

    const secondUp = await reconcileMigrations({ databaseUrl, targetVersion: '0.1.0' });
    assert.deepEqual(secondUp.applied, []);
    assert.deepEqual(secondUp.rolledBack, []);

    const down = await reconcileMigrations({ databaseUrl, targetVersion: '0.0.0' });
    assert.deepEqual(down.applied, []);
    assert.deepEqual(down.rolledBack, ['001_users_user_settings']);

    const statusAfterDown = await getMigrationStatus({
      databaseUrl,
      targetVersion: '0.0.0',
    });

    assert.deepEqual(statusAfterDown.applied, []);
    assert.deepEqual(statusAfterDown.pendingUp, []);
    assert.deepEqual(statusAfterDown.pendingDown, []);

    const upAgain = await reconcileMigrations({ databaseUrl, targetVersion: '0.1.0' });
    assert.deepEqual(upAgain.applied, ['001_users_user_settings']);
    assert.deepEqual(upAgain.rolledBack, []);

    const migrationDb = createSqliteKysely<MigrationDatabase>({ databaseUrl });

    try {
      const rows = await migrationDb
        .selectFrom('migration')
        .selectAll()
        .orderBy('id', 'asc')
        .execute();

      assert.equal(rows.length, 1);
      assert.equal(rows[0].migration_id, '001_users_user_settings');
      assert.equal(rows[0].version, '0.1.0');
    } finally {
      await migrationDb.destroy();
    }
  });

  it('should fail safely when an unknown migration id is found in migration table', async () => {
    const databaseUrl = createTempDatabasePath('migrations-unknown');

    await reconcileMigrations({ databaseUrl, targetVersion: '0.1.0' });

    const migrationDb = createSqliteKysely<MigrationDatabase>({ databaseUrl });

    try {
      await migrationDb
        .insertInto('migration')
        .values({
          migration_id: '999_unknown_migration',
          version: '9.9.9',
          applied_at: new Date().toISOString(),
        })
        .execute();
    } finally {
      await migrationDb.destroy();
    }

    await assert.rejects(
      () => getMigrationStatus({ databaseUrl, targetVersion: '0.1.0' }),
      /not present in current registry/i,
    );
  });

  it('should execute bootstrap migrate + seed with seed idempotency', async () => {
    const databaseUrl = createTempDatabasePath('bootstrap');

    await reconcileMigrations({ databaseUrl, targetVersion: '0.1.0' });

    const userId = await (async (): Promise<number> => {
      const db = createSqliteKysely<FortunaDatabase>({ databaseUrl });

      try {
        const users = createUsersRepository(db);
        const user = await users.create({
          name: 'Seed Bootstrap User',
          email: 'seed.bootstrap@fortuna.local',
          password: 'hash-seed-bootstrap',
        });

        return user.id;
      } finally {
        await db.destroy();
      }
    })();

    const firstSeed = await runSeeds({ databaseUrl, mode: 'all', userId });
    assert.equal(firstSeed.accountTypesInserted, 5);
    assert.equal(firstSeed.categoryGroupsInserted, 5);
    assert.equal(firstSeed.categoriesInserted, 12);

    const secondSeed = await runSeeds({ databaseUrl, mode: 'all', userId });
    assert.equal(secondSeed.accountTypesInserted, 0);
    assert.equal(secondSeed.categoryGroupsInserted, 0);
    assert.equal(secondSeed.categoriesInserted, 0);
  });
});
