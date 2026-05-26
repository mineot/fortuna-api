import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'credit_card_purchases'

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
      table
        .integer('credit_card_invoice_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('credit_card_invoices')
        .onDelete('SET NULL')
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
      table.string('description').nullable()
      table.text('notes').nullable()
      table.date('purchase_date').notNullable()
      table.integer('amount_cents').notNullable()
      table.integer('installments_count').notNullable().defaultTo(1)
      table.string('status').notNullable().defaultTo('active')
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
