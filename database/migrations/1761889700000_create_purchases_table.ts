import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'purchases';

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
        .integer('account_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('accounts')
        .onDelete('SET NULL');
      table
        .integer('shopping_list_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('shopping_lists')
        .onDelete('SET NULL');
      table.string('title', 160).notNullable();
      table.date('purchase_date').notNullable();
      table.decimal('total_amount', 14, 2).notNullable().defaultTo(0);
      table.string('status', 20).notNullable().defaultTo('open');
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();
      table.index(['user_id', 'purchase_date']);
      table.index(['user_id', 'status']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
