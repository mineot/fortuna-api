import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface MigrationTable {
  id: Generated<number>;
  name: string;
  version: number;
  executed_at: string;
}

export type Migration = Selectable<MigrationTable>;
export type MigrationUpdate = Updateable<MigrationTable>;
export type NewMigration = Insertable<MigrationTable>;
