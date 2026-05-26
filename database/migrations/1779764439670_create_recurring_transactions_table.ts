import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recurring_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('RESTRICT')
      table
        .integer('category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
      table
        .integer('payee_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('payees')
        .onDelete('SET NULL')
      table.string('type').notNullable()
      table.string('description').nullable()
      table.integer('amount_cents').notNullable()
      table.string('frequency').notNullable()
      table.integer('interval').notNullable().defaultTo(1)
      table.date('start_date').notNullable()
      table.date('end_date').nullable()
      table.date('next_occurrence_date').nullable()
      table.timestamp('last_generated_at').nullable()
      table.string('status').notNullable().defaultTo('active')
      table.boolean('auto_create').notNullable().defaultTo(false)
      table.text('notes').nullable()
      table.boolean('archived').notNullable().defaultTo(false)
      table.timestamp('archived_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
