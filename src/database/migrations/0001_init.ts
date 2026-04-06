import { Kysely } from 'kysely';
import type { Database } from '../schemas';
import type { MigrationDefinition } from '../migrator';

export const migration0001Init: MigrationDefinition = {
  name: '0001_init',
  version: 1,

  async up(db: Kysely<Database>): Promise<void> {
    await db.schema
      .createTable('types')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
      .addColumn('created_at', 'text', (column) => column.notNull())
      .addColumn('updated_at', 'text', (column) => column.notNull())
      .addColumn('group', 'integer', (column) => column.notNull())
      .addColumn('name', 'text', (column) => column.notNull())
      .execute();
  },

  async down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('types').ifExists().execute();
  },
};
