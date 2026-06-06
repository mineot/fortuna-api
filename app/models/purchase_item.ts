import Category from '#models/category';
import Payee from '#models/payee';
import Purchase from '#models/purchase';
import ShoppingListItem from '#models/shopping_list_item';
import User from '#models/user';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class PurchaseItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare purchaseId: number;

  @column()
  declare shoppingListItemId: number | null;

  @column()
  declare categoryId: number | null;

  @column()
  declare payeeId: number | null;

  @column()
  declare name: string;

  @column()
  declare quantity: string;

  @column()
  declare unitPrice: string;

  @column()
  declare totalPrice: string;

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

  @belongsTo(() => Purchase)
  declare purchase: BelongsTo<typeof Purchase>;

  @belongsTo(() => ShoppingListItem)
  declare shoppingListItem: BelongsTo<typeof ShoppingListItem>;

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>;

  @belongsTo(() => Payee)
  declare payee: BelongsTo<typeof Payee>;
}
