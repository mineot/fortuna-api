import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import BudgetCategory from '#models/budget_category';
import CategoryGroup from '#models/category_group';
import CreditCardPurchase from '#models/credit_card_purchase';
import PurchaseItem from '#models/purchase_item';
import RecurringTransaction from '#models/recurring_transaction';
import Transaction from '#models/transaction';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare categoryGroupId: number;

  @column()
  declare name: string;

  @column()
  declare type: string;

  @column()
  declare color: string | null;

  @column()
  declare icon: string | null;

  @column()
  declare position: number;

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

  @belongsTo(() => CategoryGroup)
  declare categoryGroup: BelongsTo<typeof CategoryGroup>;

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>;

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>;

  @hasMany(() => BudgetCategory)
  declare budgetCategories: HasMany<typeof BudgetCategory>;

  @hasMany(() => CreditCardPurchase)
  declare creditCardPurchases: HasMany<typeof CreditCardPurchase>;

  @hasMany(() => PurchaseItem)
  declare purchaseItems: HasMany<typeof PurchaseItem>;
}
