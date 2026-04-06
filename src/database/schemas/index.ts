import { MigrationTable, Migration, NewMigration, MigrationUpdate } from './_migrations.schema';
import { TypeTable, Type, FilterTypes, NewType, TypeUpdate } from './_types.schema';
import type { Generated } from 'kysely';

export interface BaseTable {
  id: Generated<number>;
  created_at: string;
  updated_at: string;
}

// export interface Archivetable extends BaseTable {
//   archived: boolean;
//   archived_at: string;
// }

export interface Database {
  migrations: MigrationTable;
  types: TypeTable;
}

export type { FilterTypes, Migration, MigrationUpdate, NewMigration, NewType, Type, TypeUpdate };
