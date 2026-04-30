import type { Kysely } from 'kysely';

import type { Database } from './schema';

export async function ensureMigrationsTable(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('migrations')
    .ifNotExists()
    .addColumn('version', 'integer', (column) => column.primaryKey())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('executed_at', 'text', (column) => column.notNull())
    .execute();
}
