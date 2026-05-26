import { PayeeSchema } from '#database/schema'
import RecurringTransaction from '#models/recurring_transaction'
import Transaction from '#models/transaction'
import CreditCardPurchase from '#models/credit_card_purchase'
import Purchase from '#models/purchase'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Payee extends PayeeSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>

  @hasMany(() => CreditCardPurchase)
  declare creditCardPurchases: HasMany<typeof CreditCardPurchase>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>
}
