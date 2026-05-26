import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'budgets'

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
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('period_type').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('amount_cents').notNullable()
      table.integer('alert_percentage').nullable()
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
