import type { Migration } from '../core/migrator';

export const initMigration: Migration = {
  name: '0001_init',
  projectVersion: '1.0.0',
  async up(database) {
    await database.schema
      .createTable('types')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('group', 'text', (col) => col.notNull())
      .addColumn('createdAt', 'text', (col) => col.notNull().defaultTo('now()'))
      .addColumn('updatedAt', 'text', (col) => col.notNull().defaultTo('now()'))
      .execute();

    await database.schema
      .createTable('meta')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('currency', 'integer', (col) => col.notNull().references('types.id'))
      .addColumn('locale', 'integer', (col) => col.notNull().references('types.id'))
      .addColumn('fiscalYearStartMonth', 'integer', (col) => col.notNull())
      .addColumn('monthCutoffDay', 'integer', (col) => col.notNull())
      .addColumn('createdAt', 'text', (col) => col.notNull().defaultTo('now()'))
      .addColumn('updatedAt', 'text', (col) => col.notNull().defaultTo('now()'))
      .execute();
  },
  async down(database) {
    await database.schema.dropTable('meta').ifExists().execute();
    await database.schema.dropTable('types').ifExists().execute();
  },
};
