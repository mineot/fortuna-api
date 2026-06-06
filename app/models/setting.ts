import User from '#models/user';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

function consumeDateTime(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  if (DateTime.isDateTime(value)) {
    return value;
  }

  if (value instanceof Date) {
    return DateTime.fromJSDate(value);
  }

  if (typeof value === 'number') {
    return Math.abs(value) < 1_000_000_000_000
      ? DateTime.fromSeconds(value)
      : DateTime.fromMillis(value);
  }

  if (typeof value === 'string') {
    return DateTime.fromSQL(value);
  }

  return value;
}

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare currency: string;

  @column()
  declare locale: string;

  @column()
  declare timezone: string;

  @column.dateTime({ consume: consumeDateTime })
  declare localeInitializedAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;
}
