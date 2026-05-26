import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

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
        .nullable()
        .references('id')
        .inTable('accounts')
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
      table
        .integer('shopping_list_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('shopping_lists')
        .onDelete('SET NULL')
      table
        .integer('transaction_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('transactions')
        .onDelete('SET NULL')
      table.string('description').nullable()
      table.date('purchase_date').notNullable()
      table.integer('total_amount_cents').notNullable()
      table.string('payment_method').nullable()
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
