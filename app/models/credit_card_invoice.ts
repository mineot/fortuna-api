import CreditCard from '#models/credit_card';
import CreditCardInstallment from '#models/credit_card_installment';
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class CreditCardInvoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare creditCardId: number;

  @column()
  declare referenceMonth: string;

  @column.date()
  declare periodStart: DateTime;

  @column.date()
  declare periodEnd: DateTime;

  @column.date()
  declare dueDate: DateTime;

  @column()
  declare totalAmount: string;

  @column()
  declare minimumAmount: string;

  @column()
  declare paidAmount: string;

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

  @belongsTo(() => CreditCard)
  declare creditCard: BelongsTo<typeof CreditCard>;

  @hasMany(() => CreditCardInstallment)
  declare installments: HasMany<typeof CreditCardInstallment>;

  @hasMany(() => CreditCardInvoicePayment)
  declare payments: HasMany<typeof CreditCardInvoicePayment>;
}
