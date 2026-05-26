import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'credit_card_installments'

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
        .integer('credit_card_purchase_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('credit_card_purchases')
        .onDelete('CASCADE')
      table
        .integer('credit_card_invoice_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('credit_card_invoices')
        .onDelete('SET NULL')
      table.integer('installment_number').notNullable()
      table.integer('total_installments').notNullable()
      table.integer('amount_cents').notNullable()
      table.date('due_date').notNullable()
      table.string('status').notNullable().defaultTo('pending')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
