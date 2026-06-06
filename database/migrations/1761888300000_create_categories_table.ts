import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'categories';

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

      table
        .integer('category_group_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('category_groups')
        .onDelete('RESTRICT');

      table.string('name', 120).notNullable();
      table.string('type', 20).notNullable().defaultTo('expense');
      table.string('color', 20).nullable();
      table.string('icon', 50).nullable();
      table.integer('position').notNullable().defaultTo(0);
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.unique(['user_id', 'name']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
