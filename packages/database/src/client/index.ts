import { Kysely, type Dialect } from 'kysely';
import type { Database as SharedDatabase } from '@repo/shared';

export type DatabaseSchema = SharedDatabase;
export type DatabaseClient = Kysely<DatabaseSchema>;

export interface CreateDatabaseClientOptions {
  dialect: Dialect;
}

export const createDatabaseClient = (
  options: CreateDatabaseClientOptions,
): DatabaseClient =>
  new Kysely<DatabaseSchema>({
    dialect: options.dialect,
  });

export const destroyDatabaseClient = async (db: DatabaseClient): Promise<void> => {
  await db.destroy();
};
