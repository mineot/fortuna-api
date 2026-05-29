import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'credit_cards';

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

      table.string('name', 120).notNullable();
      table.string('brand', 40).nullable();
      table.string('last_four_digits', 4).nullable();
      table.decimal('credit_limit', 14, 2).notNullable().defaultTo(0);
      table.integer('closing_day').notNullable();
      table.integer('due_day').notNullable();
      table.string('status', 20).notNullable().defaultTo('active');
      table.text('notes').nullable();

      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.unique(['user_id', 'name']);
      table.index(['user_id', 'status']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
