import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'credit_card_invoices'

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
        .integer('credit_card_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('credit_cards')
        .onDelete('CASCADE')
      table.integer('reference_month').notNullable()
      table.integer('reference_year').notNullable()
      table.date('opening_date').notNullable()
      table.date('closing_date').notNullable()
      table.date('due_date').notNullable()
      table.integer('total_amount_cents').notNullable().defaultTo(0)
      table.integer('paid_amount_cents').notNullable().defaultTo(0)
      table.string('status').notNullable().defaultTo('open')
      table.timestamp('closed_at').nullable()
      table.timestamp('paid_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
