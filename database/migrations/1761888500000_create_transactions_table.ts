import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'transactions';

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
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('RESTRICT');

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

      table.string('type', 20).notNullable().defaultTo('expense');
      table.decimal('amount', 14, 2).notNullable();
      table.date('transaction_date').notNullable();
      table.string('status', 20).notNullable().defaultTo('posted');
      table.text('description').nullable();
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.index(['user_id', 'transaction_date']);
      table.index(['account_id', 'transaction_date']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
