import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import Account from '#models/account';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';

export default class AccountType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare name: string;

  @column()
  declare description: string | null;

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

  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>;
}
