import Account from '#models/account';
import CreditCardInvoice from '#models/credit_card_invoice';
import Transaction from '#models/transaction';
import User from '#models/user';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class CreditCardInvoicePayment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare creditCardInvoiceId: number;

  @column()
  declare accountId: number;

  @column()
  declare transactionId: number | null;

  @column()
  declare amount: string;

  @column.date()
  declare paymentDate: DateTime;

  @column()
  declare status: string;

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

  @belongsTo(() => CreditCardInvoice)
  declare invoice: BelongsTo<typeof CreditCardInvoice>;

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>;
}
