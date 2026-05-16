import type {
  Database as FortunaDatabase,
  NewTransaction,
  Transaction,
  TransactionStatus,
  TransactionType,
  TransactionUpdate,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface TransactionListFilters {
  accountId?: number;
  categoryId?: number;
  payeeId?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface TransactionsRepository {
  create: (payload: NewTransaction) => Promise<Transaction>;
  findById: (userId: number, transactionId: number) => Promise<Transaction | undefined>;
  listByUser: (userId: number, filters?: TransactionListFilters) => Promise<Transaction[]>;
  updateById: (
    userId: number,
    transactionId: number,
    payload: TransactionUpdate,
  ) => Promise<Transaction | undefined>;
  deleteById: (userId: number, transactionId: number) => Promise<boolean>;
}

export const createTransactionsRepository = (
  db: Kysely<FortunaDatabase>,
): TransactionsRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('transactions').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (userId, transactionId) => {
      return db
        .selectFrom('transactions')
        .selectAll()
        .where('id', '=', transactionId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('transactions')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('date', 'desc')
        .orderBy('id', 'desc');

      if (filters.accountId) {
        query = query.where('account_id', '=', filters.accountId);
      }

      if (filters.categoryId) {
        query = query.where('category_id', '=', filters.categoryId);
      }

      if (typeof filters.payeeId === 'number') {
        query = query.where('payee_id', '=', filters.payeeId);
      }

      if (filters.type) {
        query = query.where('type', '=', filters.type);
      }

      if (filters.status) {
        query = query.where('status', '=', filters.status);
      }

      if (filters.dateFrom) {
        query = query.where('date', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('date', '<=', filters.dateTo);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, transactionId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('transactions')
          .selectAll()
          .where('id', '=', transactionId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('transactions')
        .set(payload)
        .where('id', '=', transactionId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, transactionId) => {
      const result = await db
        .deleteFrom('transactions')
        .where('id', '=', transactionId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
