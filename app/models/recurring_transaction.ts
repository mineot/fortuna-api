import { RecurringTransactionSchema } from '#database/schema'
import Account from '#models/account'
import Category from '#models/category'
import Payee from '#models/payee'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class RecurringTransaction extends RecurringTransactionSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>
}
