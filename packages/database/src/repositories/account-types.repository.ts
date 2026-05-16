import type {
  AccountType,
  AccountTypeUpdate,
  Database as FortunaDatabase,
  NewAccountType,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface AccountTypesRepository {
  create: (payload: NewAccountType) => Promise<AccountType>;
  findById: (id: number) => Promise<AccountType | undefined>;
  list: () => Promise<AccountType[]>;
  updateById: (id: number, payload: AccountTypeUpdate) => Promise<AccountType | undefined>;
  deleteById: (id: number) => Promise<boolean>;
}

export const createAccountTypesRepository = (
  db: Kysely<FortunaDatabase>,
): AccountTypesRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('account_types')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findById: async (id) => {
      return db.selectFrom('account_types').selectAll().where('id', '=', id).executeTakeFirst();
    },

    list: async () => {
      return db.selectFrom('account_types').selectAll().orderBy('name', 'asc').execute();
    },

    updateById: async (id, payload) => {
      if (!hasPatchValues(payload)) {
        return db.selectFrom('account_types').selectAll().where('id', '=', id).executeTakeFirst();
      }

      return db
        .updateTable('account_types')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (id) => {
      const result = await db.deleteFrom('account_types').where('id', '=', id).executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
