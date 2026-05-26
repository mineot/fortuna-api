import { CreditCardInstallmentSchema } from '#database/schema'
import CreditCardInvoice from '#models/credit_card_invoice'
import CreditCardPurchase from '#models/credit_card_purchase'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class CreditCardInstallment extends CreditCardInstallmentSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CreditCardPurchase)
  declare creditCardPurchase: BelongsTo<typeof CreditCardPurchase>

  @belongsTo(() => CreditCardInvoice)
  declare creditCardInvoice: BelongsTo<typeof CreditCardInvoice>
}
