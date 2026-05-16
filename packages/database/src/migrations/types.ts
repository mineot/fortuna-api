import type { Database as FortunaDatabase } from '@repo/shared';
import type { Generated, Kysely } from 'kysely';

export interface MigrationTable {
  id: Generated<number>;
  migration_id: string;
  version: string;
  applied_at: string;
}

export type MigrationDatabase = FortunaDatabase & {
  migration: MigrationTable;
};

export interface VersionedMigration {
  id: string;
  version: string;
  up: (db: Kysely<MigrationDatabase>) => Promise<void>;
  down: (db: Kysely<MigrationDatabase>) => Promise<void>;
}

export interface MigrationReconcileReport {
  targetVersion: string;
  applied: string[];
  rolledBack: string[];
}
