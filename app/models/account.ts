import { AccountSchema } from '#database/schema'
import AccountType from '#models/account_type'
import CreditCard from '#models/credit_card'
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment'
import Purchase from '#models/purchase'
import RecurringTransaction from '#models/recurring_transaction'
import Transfer from '#models/transfer'
import Transaction from '#models/transaction'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Account extends AccountSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => AccountType)
  declare accountType: BelongsTo<typeof AccountType>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>

  @hasMany(() => CreditCard)
  declare creditCards: HasMany<typeof CreditCard>

  @hasMany(() => CreditCardInvoicePayment)
  declare creditCardInvoicePayments: HasMany<typeof CreditCardInvoicePayment>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>

  @hasMany(() => Transfer, {
    foreignKey: 'sourceAccountId',
  })
  declare sourceTransfers: HasMany<typeof Transfer>

  @hasMany(() => Transfer, {
    foreignKey: 'destinationAccountId',
  })
  declare destinationTransfers: HasMany<typeof Transfer>
}
