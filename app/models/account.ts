import AccountType from '#models/account_type';
import CreditCard from '#models/credit_card';
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment';
import Purchase from '#models/purchase';
import RecurringTransaction from '#models/recurring_transaction';
import Transaction from '#models/transaction';
import Transfer from '#models/transfer';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare accountTypeId: number;

  @column()
  declare name: string;

  @column()
  declare initialBalance: string;

  @column()
  declare currentBalance: string;

  @column()
  declare currency: string;

  @column()
  declare notes: string | null;

  @column()
  declare archived: boolean;

  @column.dateTime()
  declare archivedAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => AccountType)
  declare accountType: BelongsTo<typeof AccountType>;

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>;

  @hasMany(() => Transfer, { foreignKey: 'fromAccountId' })
  declare outgoingTransfers: HasMany<typeof Transfer>;

  @hasMany(() => Transfer, { foreignKey: 'toAccountId' })
  declare incomingTransfers: HasMany<typeof Transfer>;

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>;

  @hasMany(() => CreditCard)
  declare creditCards: HasMany<typeof CreditCard>;

  @hasMany(() => CreditCardInvoicePayment)
  declare creditCardInvoicePayments: HasMany<typeof CreditCardInvoicePayment>;

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>;
}
