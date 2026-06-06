import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'budget_categories';

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
        .integer('budget_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('budgets')
        .onDelete('CASCADE');

      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT');

      table.decimal('planned_amount', 14, 2).notNullable().defaultTo(0);
      table.decimal('carryover_amount', 14, 2).notNullable().defaultTo(0);
      table.text('notes').nullable();
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.unique(['budget_id', 'category_id']);
      table.index(['user_id', 'budget_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
