import { CreditCardInvoicePaymentSchema } from '#database/schema'
import Account from '#models/account'
import CreditCardInvoice from '#models/credit_card_invoice'
import Transaction from '#models/transaction'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class CreditCardInvoicePayment extends CreditCardInvoicePaymentSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CreditCardInvoice)
  declare creditCardInvoice: BelongsTo<typeof CreditCardInvoice>

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>
}
