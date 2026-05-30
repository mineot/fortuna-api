import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { translatedNameSelect } from '#services/translated_term_select';
import Category from '#models/category';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';

export default class CategoryGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column({ columnName: 'term_key' })
  declare termKey: string;

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

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>;

  static queryTranslated(locale: string, fallbackLocale: string, userId?: number | null) {
    return this.query()
      .select('category_groups.*')
      .select(
        translatedNameSelect({
          tableName: 'category_groups',
          namespace: 'category_groups',
          locale,
          fallbackLocale,
          userId,
        }),
      );
  }
}
