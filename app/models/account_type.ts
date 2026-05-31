import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { translatedNameSelect } from '#services/translated_term_select';
import Account from '#models/account';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';

export default class AccountType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column({ columnName: 'term_key' })
  declare termKey: string;

  @column({ columnName: 'description_term_key' })
  declare descriptionTermKey: string | null;

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

  static queryTranslated(locale: string, fallbackLocale: string, userId?: number | null) {
    return this.query()
      .select('account_types.*')
      .select(
        translatedNameSelect({
          tableName: 'account_types',
          namespace: 'account_types',
          locale,
          fallbackLocale,
          userId,
        }),
      )
      .select(
        translatedNameSelect({
          tableName: 'account_types',
          namespace: 'account_types',
          locale,
          fallbackLocale,
          termKeyColumn: 'description_term_key',
          outputAlias: 'description',
          fallbackToTermKey: false,
          userId,
        }),
      );
  }
}
