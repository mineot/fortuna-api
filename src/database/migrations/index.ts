import { createTypesTableMigration } from './001_create_types_table';
import type { Migration } from './types';

export const migrations: Migration[] = [createTypesTableMigration];
