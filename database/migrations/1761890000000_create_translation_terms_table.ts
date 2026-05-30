import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'translation_terms';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable();

      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('namespace', 100).notNullable();
      table.string('term_key', 140).notNullable();
      table.string('locale', 10).notNullable();
      table.text('value').notNullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.unique(['user_id', 'namespace', 'term_key', 'locale']);
      table.index(['namespace', 'term_key', 'locale']);
      table.index(['user_id', 'locale']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
