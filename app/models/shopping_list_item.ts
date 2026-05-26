import { ShoppingListItemSchema } from '#database/schema'
import ShoppingList from '#models/shopping_list'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ShoppingListItem extends ShoppingListItemSchema {
  @belongsTo(() => ShoppingList)
  declare shoppingList: BelongsTo<typeof ShoppingList>
}
