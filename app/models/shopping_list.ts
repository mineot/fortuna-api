import { ShoppingListSchema } from '#database/schema'
import Purchase from '#models/purchase'
import ShoppingListItem from '#models/shopping_list_item'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class ShoppingList extends ShoppingListSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => ShoppingListItem)
  declare items: HasMany<typeof ShoppingListItem>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>
}
