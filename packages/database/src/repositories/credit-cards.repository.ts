import type {
  CreditCard,
  CreditCardUpdate,
  Database as FortunaDatabase,
  NewCreditCard,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils.js';

export interface CreditCardListFilters {
  limit?: number;
  offset?: number;
}

export interface CreditCardsRepository {
  create: (payload: NewCreditCard) => Promise<CreditCard>;
  findById: (userId: number, creditCardId: number) => Promise<CreditCard | undefined>;
  listByUser: (userId: number, filters?: CreditCardListFilters) => Promise<CreditCard[]>;
  updateById: (
    userId: number,
    creditCardId: number,
    payload: CreditCardUpdate,
  ) => Promise<CreditCard | undefined>;
  deleteById: (userId: number, creditCardId: number) => Promise<boolean>;
}

export const createCreditCardsRepository = (db: Kysely<FortunaDatabase>): CreditCardsRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('credit_cards').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (userId, creditCardId) => {
      return db
        .selectFrom('credit_cards')
        .selectAll()
        .where('id', '=', creditCardId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('credit_cards')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('id', 'asc');

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, creditCardId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('credit_cards')
          .selectAll()
          .where('id', '=', creditCardId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('credit_cards')
        .set(payload)
        .where('id', '=', creditCardId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, creditCardId) => {
      const result = await db
        .deleteFrom('credit_cards')
        .where('id', '=', creditCardId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
