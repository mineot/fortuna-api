import type { Account, AccountUpdate, Database as FortunaDatabase, NewAccount } from '@repo/shared';
import { sql, type Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils.js';

export interface AccountListFilters {
  accountTypeId?: number;
  limit?: number;
  offset?: number;
}

export interface AccountsRepository {
  create: (payload: NewAccount) => Promise<Account>;
  findById: (userId: number, accountId: number) => Promise<Account | undefined>;
  listByUser: (userId: number, filters?: AccountListFilters) => Promise<Account[]>;
  updateById: (
    userId: number,
    accountId: number,
    payload: AccountUpdate,
  ) => Promise<Account | undefined>;
  deleteById: (userId: number, accountId: number) => Promise<boolean>;
  getCurrentBalance: (userId: number, accountId: number) => Promise<number | undefined>;
}

export const createAccountsRepository = (db: Kysely<FortunaDatabase>): AccountsRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('accounts').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (userId, accountId) => {
      return db
        .selectFrom('accounts')
        .selectAll()
        .where('id', '=', accountId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('accounts')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('id', 'asc');

      if (filters.accountTypeId) {
        query = query.where('account_type_id', '=', filters.accountTypeId);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, accountId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('accounts')
          .selectAll()
          .where('id', '=', accountId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('accounts')
        .set(payload)
        .where('id', '=', accountId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, accountId) => {
      const result = await db
        .deleteFrom('accounts')
        .where('id', '=', accountId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },

    getCurrentBalance: async (userId, accountId) => {
      const account = await db
        .selectFrom('accounts')
        .select(['initial_balance'])
        .where('id', '=', accountId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (!account) {
        return undefined;
      }

      const income = await db
        .selectFrom('transactions')
        .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
        .where('user_id', '=', userId)
        .where('account_id', '=', accountId)
        .where('status', '=', 'confirmed')
        .where('type', '=', 'income')
        .executeTakeFirstOrThrow();

      const expense = await db
        .selectFrom('transactions')
        .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
        .where('user_id', '=', userId)
        .where('account_id', '=', accountId)
        .where('status', '=', 'confirmed')
        .where('type', '=', 'expense')
        .executeTakeFirstOrThrow();

      const incomingTransfers = await db
        .selectFrom('transfers')
        .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
        .where('user_id', '=', userId)
        .where('destination_account_id', '=', accountId)
        .where('status', '=', 'confirmed')
        .executeTakeFirstOrThrow();

      const outgoingTransfers = await db
        .selectFrom('transfers')
        .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
        .where('user_id', '=', userId)
        .where('source_account_id', '=', accountId)
        .where('status', '=', 'confirmed')
        .executeTakeFirstOrThrow();

      return (
        toNumber(account.initial_balance) +
        toNumber(income.total) -
        toNumber(expense.total) +
        toNumber(incomingTransfers.total) -
        toNumber(outgoingTransfers.total)
      );
    },
  };
};
