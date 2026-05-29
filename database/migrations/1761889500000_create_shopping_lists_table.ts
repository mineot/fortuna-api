import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'shopping_lists';

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
      table.string('name', 140).notNullable();
      table.string('status', 20).notNullable().defaultTo('open');
      table.date('target_date').nullable();
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
