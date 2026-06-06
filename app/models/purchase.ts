import Account from '#models/account';
import PurchaseItem from '#models/purchase_item';
import ShoppingList from '#models/shopping_list';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Purchase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare accountId: number | null;

  @column()
  declare shoppingListId: number | null;

  @column()
  declare title: string;

  @column.date()
  declare purchaseDate: DateTime;

  @column()
  declare totalAmount: string;

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

  @belongsTo(() => ShoppingList)
  declare shoppingList: BelongsTo<typeof ShoppingList>;

  @hasMany(() => PurchaseItem)
  declare items: HasMany<typeof PurchaseItem>;
}
