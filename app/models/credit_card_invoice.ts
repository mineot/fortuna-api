import { CreditCardInvoiceSchema } from '#database/schema'
import CreditCard from '#models/credit_card'
import CreditCardInstallment from '#models/credit_card_installment'
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment'
import CreditCardPurchase from '#models/credit_card_purchase'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class CreditCardInvoice extends CreditCardInvoiceSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CreditCard)
  declare creditCard: BelongsTo<typeof CreditCard>

  @hasMany(() => CreditCardPurchase)
  declare purchases: HasMany<typeof CreditCardPurchase>

  @hasMany(() => CreditCardInstallment)
  declare installments: HasMany<typeof CreditCardInstallment>

  @hasMany(() => CreditCardInvoicePayment)
  declare payments: HasMany<typeof CreditCardInvoicePayment>
}
