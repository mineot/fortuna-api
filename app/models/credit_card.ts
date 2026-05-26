import { CreditCardSchema } from '#database/schema'
import Account from '#models/account'
import CreditCardInvoice from '#models/credit_card_invoice'
import CreditCardPurchase from '#models/credit_card_purchase'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class CreditCard extends CreditCardSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @hasMany(() => CreditCardInvoice)
  declare invoices: HasMany<typeof CreditCardInvoice>

  @hasMany(() => CreditCardPurchase)
  declare purchases: HasMany<typeof CreditCardPurchase>
}
