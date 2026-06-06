import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'credit_card_invoices';

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
        .integer('credit_card_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('credit_cards')
        .onDelete('CASCADE');

      table.string('reference_month', 7).notNullable();
      table.date('period_start').notNullable();
      table.date('period_end').notNullable();
      table.date('due_date').notNullable();
      table.decimal('total_amount', 14, 2).notNullable().defaultTo(0);
      table.decimal('minimum_amount', 14, 2).notNullable().defaultTo(0);
      table.decimal('paid_amount', 14, 2).notNullable().defaultTo(0);
      table.string('status', 20).notNullable().defaultTo('open');
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.unique(['credit_card_id', 'reference_month']);
      table.index(['user_id', 'status']);
      table.index(['user_id', 'due_date']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
