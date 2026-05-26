import { TransactionSchema } from '#database/schema'
import Account from '#models/account'
import Category from '#models/category'
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment'
import Payee from '#models/payee'
import Purchase from '#models/purchase'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Transaction extends TransactionSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>

  @hasMany(() => CreditCardInvoicePayment)
  declare creditCardInvoicePayments: HasMany<typeof CreditCardInvoicePayment>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>
}
