import PurchaseItem from '#models/purchase_item';
import ShoppingList from '#models/shopping_list';
import User from '#models/user';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class ShoppingListItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;
  @column()
  declare userId: number;
  @column()
  declare shoppingListId: number;
  @column()
  declare name: string;
  @column()
  declare quantity: string;
  @column()
  declare unit: string | null;
  @column()
  declare estimatedPrice: string | null;
  @column()
  declare checked: boolean;
  @column()
  declare position: number;
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
  @belongsTo(() => ShoppingList)
  declare shoppingList: BelongsTo<typeof ShoppingList>;
  @hasMany(() => PurchaseItem)
  declare purchaseItems: HasMany<typeof PurchaseItem>;
}
