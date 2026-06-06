import Purchase from '#models/purchase';
import ShoppingListItem from '#models/shopping_list_item';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class ShoppingList extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare name: string;

  @column()
  declare status: string;

  @column.date()
  declare targetDate: DateTime | null;

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

  @hasMany(() => ShoppingListItem)
  declare items: HasMany<typeof ShoppingListItem>;

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>;
}
