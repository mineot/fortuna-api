import type { Database as FortunaDatabase, NewPayee, Payee, PayeeUpdate } from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils.js';

export interface PayeeListFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PayeesRepository {
  create: (payload: NewPayee) => Promise<Payee>;
  findById: (userId: number, payeeId: number) => Promise<Payee | undefined>;
  listByUser: (userId: number, filters?: PayeeListFilters) => Promise<Payee[]>;
  updateById: (userId: number, payeeId: number, payload: PayeeUpdate) => Promise<Payee | undefined>;
  deleteById: (userId: number, payeeId: number) => Promise<boolean>;
}

export const createPayeesRepository = (db: Kysely<FortunaDatabase>): PayeesRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('payees').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (userId, payeeId) => {
      return db
        .selectFrom('payees')
        .selectAll()
        .where('id', '=', payeeId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('payees')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('name', 'asc');

      if (filters.search) {
        query = query.where('name', 'like', `%${filters.search}%`);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, payeeId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('payees')
          .selectAll()
          .where('id', '=', payeeId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('payees')
        .set(payload)
        .where('id', '=', payeeId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, payeeId) => {
      const result = await db
        .deleteFrom('payees')
        .where('id', '=', payeeId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
