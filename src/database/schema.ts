import type { Generated, Selectable, Insertable, Updateable } from 'kysely';

interface BaseTable {
  id: Generated<number>;
  created_at: string;
  updated_at: string;
}

// interface Archivetable extends BaseTable {
//   archived: boolean;
//   archived_at: string;
// }

export interface MigrationTable {
  id: Generated<number>;
  name: string;
  version: number;
  executed_at: string;
}

export interface TypeTable extends BaseTable {
  group: number;
  name: string;
}

export interface Database {
  migrations: MigrationTable;
  types: TypeTable;
}

export type Migration = Selectable<MigrationTable>;
export type NewMigration = Insertable<MigrationTable>;
export type MigrationUpdate = Updateable<MigrationTable>;

export type FilterTypes = { group?: number; name?: string };
export type NewType = Insertable<TypeTable>;
export type TypeSelect = Selectable<TypeTable>;
export type TypeUpdate = Updateable<TypeTable>;
