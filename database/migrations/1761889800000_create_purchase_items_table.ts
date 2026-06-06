import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'purchase_items';

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
        .integer('purchase_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('purchases')
        .onDelete('CASCADE');

      table
        .integer('shopping_list_item_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('shopping_list_items')
        .onDelete('SET NULL');

      table
        .integer('category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL');

      table
        .integer('payee_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('payees')
        .onDelete('SET NULL');

      table.string('name', 160).notNullable();
      table.decimal('quantity', 12, 3).notNullable().defaultTo(1);
      table.decimal('unit_price', 14, 2).notNullable().defaultTo(0);
      table.decimal('total_price', 14, 2).notNullable().defaultTo(0);
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.index(['purchase_id']);
      table.index(['user_id', 'category_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
