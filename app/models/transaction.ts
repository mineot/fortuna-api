import Account from '#models/account';
import Category from '#models/category';
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment';
import Payee from '#models/payee';
import Transfer from '#models/transfer';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare accountId: number;

  @column()
  declare categoryId: number | null;

  @column()
  declare payeeId: number | null;

  @column()
  declare type: string;

  @column()
  declare amount: string;

  @column.date()
  declare transactionDate: DateTime;

  @column()
  declare status: string;

  @column()
  declare description: string | null;

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

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>;

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>;

  @hasOne(() => Transfer, { foreignKey: 'outTransactionId' })
  declare outgoingTransfer: HasOne<typeof Transfer>;

  @hasOne(() => Transfer, { foreignKey: 'inTransactionId' })
  declare incomingTransfer: HasOne<typeof Transfer>;

  @hasOne(() => CreditCardInvoicePayment)
  declare creditCardInvoicePayment: HasOne<typeof CreditCardInvoicePayment>;
}
