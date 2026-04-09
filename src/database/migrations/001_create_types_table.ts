import type { Kysely } from 'kysely';

import type { Database } from '../schema';
import type { Migration } from './types';

async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('types')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('group', 'text', (column) => column.notNull())
    .addColumn('value', 'text', (column) => column.notNull())
    .execute();
}

async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('types').ifExists().execute();
}

export const createTypesTableMigration: Migration = {
  version: 1,
  name: 'create_types_table',
  up,
  down,
};
