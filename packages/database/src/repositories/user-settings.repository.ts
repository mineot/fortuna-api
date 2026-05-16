import type {
  Database as FortunaDatabase,
  NewUserSettings,
  UserSettings,
  UserSettingsUpdate,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface UserSettingsRepository {
  create: (payload: NewUserSettings) => Promise<UserSettings>;
  findByUserId: (userId: number) => Promise<UserSettings | undefined>;
  upsertByUserId: (
    userId: number,
    payload: Omit<NewUserSettings, 'user_id'>,
  ) => Promise<UserSettings>;
  updateByUserId: (
    userId: number,
    payload: UserSettingsUpdate,
  ) => Promise<UserSettings | undefined>;
  deleteByUserId: (userId: number) => Promise<boolean>;
}

export const createUserSettingsRepository = (
  db: Kysely<FortunaDatabase>,
): UserSettingsRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('user_settings')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findByUserId: async (userId) => {
      return db
        .selectFrom('user_settings')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    upsertByUserId: async (userId, payload) => {
      return db
        .insertInto('user_settings')
        .values({
          user_id: userId,
          ...payload,
        })
        .onConflict((conflict) =>
          conflict.column('user_id').doUpdateSet({
            locale: payload.locale,
            currency: payload.currency,
            fiscal_year_cutoff_day: payload.fiscal_year_cutoff_day,
            fiscal_year_cutoff_month: payload.fiscal_year_cutoff_month,
          }),
        )
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    updateByUserId: async (userId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('user_settings')
          .selectAll()
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('user_settings')
        .set(payload)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteByUserId: async (userId) => {
      const result = await db
        .deleteFrom('user_settings')
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
