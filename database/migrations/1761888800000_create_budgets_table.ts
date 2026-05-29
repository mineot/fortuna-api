import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'budgets';

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
      table.string('name', 120).notNullable();
      table.date('period_start').notNullable();
      table.date('period_end').notNullable();
      table.string('status', 20).notNullable().defaultTo('active');
      table.text('notes').nullable();

      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at').nullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();

      table.index(['user_id', 'period_start', 'period_end']);
      table.unique(['user_id', 'name', 'period_start']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
