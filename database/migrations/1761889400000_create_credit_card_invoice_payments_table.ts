import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'credit_card_invoice_payments';

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
        .integer('credit_card_invoice_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('credit_card_invoices')
        .onDelete('CASCADE');

      table
        .integer('account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('RESTRICT');

      table
        .integer('transaction_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('transactions')
        .onDelete('SET NULL');

      table.decimal('amount', 14, 2).notNullable();
      table.date('payment_date').notNullable();
      table.string('status', 20).notNullable().defaultTo('posted');
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.index(['user_id', 'payment_date']);
      table.index(['credit_card_invoice_id']);
      table.index(['account_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
