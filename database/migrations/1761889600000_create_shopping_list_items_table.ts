import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'shopping_list_items';

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
        .integer('shopping_list_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('shopping_lists')
        .onDelete('CASCADE');

      table.string('name', 160).notNullable();
      table.decimal('quantity', 12, 3).notNullable().defaultTo(1);
      table.string('unit', 20).nullable();
      table.decimal('estimated_price', 14, 2).nullable();
      table.boolean('checked').notNullable().defaultTo(false);
      table.integer('position').notNullable().defaultTo(0);
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.index(['shopping_list_id', 'position']);
      table.index(['user_id', 'checked']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
