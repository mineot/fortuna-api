import { CreditCardPurchaseSchema } from '#database/schema'
import Category from '#models/category'
import CreditCard from '#models/credit_card'
import CreditCardInstallment from '#models/credit_card_installment'
import CreditCardInvoice from '#models/credit_card_invoice'
import Payee from '#models/payee'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class CreditCardPurchase extends CreditCardPurchaseSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CreditCard)
  declare creditCard: BelongsTo<typeof CreditCard>

  @belongsTo(() => CreditCardInvoice)
  declare creditCardInvoice: BelongsTo<typeof CreditCardInvoice>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>

  @hasMany(() => CreditCardInstallment)
  declare installments: HasMany<typeof CreditCardInstallment>
}
