import type { MigrationTable } from './migrations.schema';
import type { NewType, Types, TypeTable, TypeUpdate } from './types.schema';

export interface Database {
  migrations: MigrationTable;
  types: TypeTable;
}

export type { NewType, Types, TypeUpdate };
