import type {
  Database as FortunaDatabase,
  NewTransfer,
  Transfer,
  TransferUpdate,
  TransactionStatus,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface TransferListFilters {
  sourceAccountId?: number;
  destinationAccountId?: number;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface TransfersRepository {
  create: (payload: NewTransfer) => Promise<Transfer>;
  findById: (userId: number, transferId: number) => Promise<Transfer | undefined>;
  listByUser: (userId: number, filters?: TransferListFilters) => Promise<Transfer[]>;
  updateById: (
    userId: number,
    transferId: number,
    payload: TransferUpdate,
  ) => Promise<Transfer | undefined>;
  deleteById: (userId: number, transferId: number) => Promise<boolean>;
}

export const createTransfersRepository = (db: Kysely<FortunaDatabase>): TransfersRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('transfers').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (userId, transferId) => {
      return db
        .selectFrom('transfers')
        .selectAll()
        .where('id', '=', transferId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('transfers')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('date', 'desc')
        .orderBy('id', 'desc');

      if (filters.sourceAccountId) {
        query = query.where('source_account_id', '=', filters.sourceAccountId);
      }

      if (filters.destinationAccountId) {
        query = query.where('destination_account_id', '=', filters.destinationAccountId);
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

    updateById: async (userId, transferId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('transfers')
          .selectAll()
          .where('id', '=', transferId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('transfers')
        .set(payload)
        .where('id', '=', transferId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, transferId) => {
      const result = await db
        .deleteFrom('transfers')
        .where('id', '=', transferId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
