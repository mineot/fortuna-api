import Budget from '#models/budget';
import Category from '#models/category';
import User from '#models/user';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class BudgetCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare budgetId: number;

  @column()
  declare categoryId: number;

  @column()
  declare plannedAmount: string;

  @column()
  declare carryoverAmount: string;

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

  @belongsTo(() => Budget)
  declare budget: BelongsTo<typeof Budget>;

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>;
}
