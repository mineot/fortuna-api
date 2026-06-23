import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'category_groups';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable();

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('name', 120).notNullable();
      table.integer('position').notNullable().defaultTo(0);
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();

      table.timestamp('created_at').nullable();
      table.timestamp('updated_at').nullable();

      table.unique(['user_id', 'name']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
