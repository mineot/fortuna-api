import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'transfers';

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
        .integer('from_account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('RESTRICT');
      table
        .integer('to_account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('RESTRICT');

      table
        .integer('out_transaction_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('transactions')
        .onDelete('SET NULL');
      table
        .integer('in_transaction_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('transactions')
        .onDelete('SET NULL');

      table.decimal('amount', 14, 2).notNullable();
      table.date('transfer_date').notNullable();
      table.string('status', 20).notNullable().defaultTo('posted');
      table.text('description').nullable();
      table.text('notes').nullable();

      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.index(['user_id', 'transfer_date']);
      table.index(['from_account_id', 'transfer_date']);
      table.index(['to_account_id', 'transfer_date']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
