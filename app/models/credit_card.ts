import Account from '#models/account';
import CreditCardInvoice from '#models/credit_card_invoice';
import CreditCardPurchase from '#models/credit_card_purchase';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class CreditCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare accountId: number | null;

  @column()
  declare name: string;

  @column()
  declare brand: string | null;

  @column()
  declare lastFourDigits: string | null;

  @column()
  declare creditLimit: string;

  @column()
  declare closingDay: number;

  @column()
  declare dueDay: number;

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

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>;

  @hasMany(() => CreditCardInvoice)
  declare invoices: HasMany<typeof CreditCardInvoice>;

  @hasMany(() => CreditCardPurchase)
  declare purchases: HasMany<typeof CreditCardPurchase>;
}
