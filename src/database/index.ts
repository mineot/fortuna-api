export type { DatabaseConfig } from './client';
export { createDatabase, destroyDb, getDb } from './client';
export { migrateTo, migrateToLatest } from './migrator';
export type { Database } from './schema';
