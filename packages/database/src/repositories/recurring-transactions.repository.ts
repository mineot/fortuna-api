import type {
  Database as FortunaDatabase,
  NewRecurringTransaction,
  RecurrenceFrequency,
  RecurrenceType,
  RecurringTransaction,
  RecurringTransactionUpdate,
  TransactionType,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface RecurringTransactionListFilters {
  active?: 0 | 1;
  accountId?: number;
  categoryId?: number;
  payeeId?: number;
  type?: TransactionType;
  recurrenceType?: RecurrenceType;
  frequency?: RecurrenceFrequency;
  dueDay?: number;
  limit?: number;
  offset?: number;
}

export interface RecurringTransactionsRepository {
  create: (payload: NewRecurringTransaction) => Promise<RecurringTransaction>;
  findById: (
    userId: number,
    recurringTransactionId: number,
  ) => Promise<RecurringTransaction | undefined>;
  listByUser: (
    userId: number,
    filters?: RecurringTransactionListFilters,
  ) => Promise<RecurringTransaction[]>;
  updateById: (
    userId: number,
    recurringTransactionId: number,
    payload: RecurringTransactionUpdate,
  ) => Promise<RecurringTransaction | undefined>;
  deleteById: (userId: number, recurringTransactionId: number) => Promise<boolean>;
}

export const createRecurringTransactionsRepository = (
  db: Kysely<FortunaDatabase>,
): RecurringTransactionsRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('recurring_transactions')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findById: async (userId, recurringTransactionId) => {
      return db
        .selectFrom('recurring_transactions')
        .selectAll()
        .where('id', '=', recurringTransactionId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('recurring_transactions')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('id', 'asc');

      if (typeof filters.active === 'number') {
        query = query.where('active', '=', filters.active);
      }

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

      if (filters.recurrenceType) {
        query = query.where('recurrence_type', '=', filters.recurrenceType);
      }

      if (filters.frequency) {
        query = query.where('frequency', '=', filters.frequency);
      }

      if (typeof filters.dueDay === 'number') {
        query = query.where('due_day', '=', filters.dueDay);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, recurringTransactionId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('recurring_transactions')
          .selectAll()
          .where('id', '=', recurringTransactionId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('recurring_transactions')
        .set(payload)
        .where('id', '=', recurringTransactionId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, recurringTransactionId) => {
      const result = await db
        .deleteFrom('recurring_transactions')
        .where('id', '=', recurringTransactionId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
