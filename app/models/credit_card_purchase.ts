import Category from '#models/category';
import CreditCard from '#models/credit_card';
import CreditCardInstallment from '#models/credit_card_installment';
import Payee from '#models/payee';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class CreditCardPurchase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare creditCardId: number;

  @column()
  declare categoryId: number | null;

  @column()
  declare payeeId: number | null;

  @column()
  declare description: string;

  @column()
  declare totalAmount: string;

  @column()
  declare installmentsCount: number;

  @column.date()
  declare purchaseDate: DateTime;

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

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>;

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>;

  @hasMany(() => CreditCardInstallment)
  declare installments: HasMany<typeof CreditCardInstallment>;
}
