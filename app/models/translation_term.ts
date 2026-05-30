import User from '#models/user';
import { BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class TranslationTerm extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number | null;

  @column()
  declare namespace: string;

  @column()
  declare termKey: string;

  @column()
  declare locale: string;

  @column()
  declare value: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  static byUser = scope((query, userId?: number | null) => {
    if (userId === undefined) return;
    if (userId === null) {
      query.whereNull('user_id');
      return;
    }

    query.where('user_id', userId);
  });

  static byNamespaceAndKey = scope((query, namespace: string, termKey: string) => {
    query.where('namespace', namespace).where('term_key', termKey);
  });

  static byLocale = scope((query, locale: string) => {
    query.where('locale', locale);
  });
}
