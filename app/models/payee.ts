import CreditCardPurchase from '#models/credit_card_purchase';
import PurchaseItem from '#models/purchase_item';
import RecurringTransaction from '#models/recurring_transaction';
import Transaction from '#models/transaction';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Payee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare name: string;

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

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>;

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>;

  @hasMany(() => CreditCardPurchase)
  declare creditCardPurchases: HasMany<typeof CreditCardPurchase>;

  @hasMany(() => PurchaseItem)
  declare purchaseItems: HasMany<typeof PurchaseItem>;
}
