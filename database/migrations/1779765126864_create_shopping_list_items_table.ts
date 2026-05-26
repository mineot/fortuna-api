import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shopping_list_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('shopping_list_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('shopping_lists')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('quantity').nullable()
      table.string('unit').nullable()
      table.integer('estimated_price_cents').nullable()
      table.text('notes').nullable()
      table.boolean('checked').notNullable().defaultTo(false)
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
