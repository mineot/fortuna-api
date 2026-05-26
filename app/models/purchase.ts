import { PurchaseSchema } from '#database/schema'
import Account from '#models/account'
import Category from '#models/category'
import Payee from '#models/payee'
import PurchaseItem from '#models/purchase_item'
import ShoppingList from '#models/shopping_list'
import Transaction from '#models/transaction'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Purchase extends PurchaseSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>

  @belongsTo(() => ShoppingList)
  declare shoppingList: BelongsTo<typeof ShoppingList>

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>

  @hasMany(() => PurchaseItem)
  declare items: HasMany<typeof PurchaseItem>
}
