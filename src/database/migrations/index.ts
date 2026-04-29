import { createTypesTableMigration } from './001_init_app';
import type { Migration } from './types';

export const migrations: Migration[] = [createTypesTableMigration];
