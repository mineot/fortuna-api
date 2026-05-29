import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'accounts';

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
        .integer('account_type_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('account_types')
        .onDelete('RESTRICT');

      table.string('name', 120).notNullable();
      table.decimal('initial_balance', 14, 2).notNullable().defaultTo(0);
      table.decimal('current_balance', 14, 2).notNullable().defaultTo(0);
      table.string('currency', 3).notNullable().defaultTo('USD');
      table.text('notes').nullable();

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
