import Account from '#models/account';
import Category from '#models/category';
import Payee from '#models/payee';
import User from '#models/user';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class RecurringTransaction extends BaseModel {
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

  @column()
  declare frequency: string;

  @column()
  declare interval: number;

  @column.date()
  declare startDate: DateTime;

  @column.date()
  declare endDate: DateTime | null;

  @column.date()
  declare nextOccurrenceDate: DateTime;

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
}
