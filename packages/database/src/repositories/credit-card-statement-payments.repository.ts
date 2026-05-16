import type {
  CreditCardStatementPayment,
  CreditCardStatementPaymentUpdate,
  Database as FortunaDatabase,
  NewCreditCardStatementPayment,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils.js';

export interface CreditCardStatementPaymentListFilters {
  accountId?: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreditCardStatementPaymentsRepository {
  create: (payload: NewCreditCardStatementPayment) => Promise<CreditCardStatementPayment>;
  findById: (userId: number, paymentId: number) => Promise<CreditCardStatementPayment | undefined>;
  listByStatement: (
    userId: number,
    statementId: number,
    filters?: CreditCardStatementPaymentListFilters,
  ) => Promise<CreditCardStatementPayment[]>;
  updateById: (
    userId: number,
    paymentId: number,
    payload: CreditCardStatementPaymentUpdate,
  ) => Promise<CreditCardStatementPayment | undefined>;
  deleteById: (userId: number, paymentId: number) => Promise<boolean>;
}

const getPaymentOwnedByUser = async (
  db: Kysely<FortunaDatabase>,
  userId: number,
  paymentId: number,
): Promise<CreditCardStatementPayment | undefined> => {
  return db
    .selectFrom('credit_card_statement_payments as p')
    .innerJoin('credit_card_statements as s', 's.id', 'p.credit_card_statement_id')
    .innerJoin('credit_cards as c', 'c.id', 's.credit_card_id')
    .selectAll('p')
    .where('p.id', '=', paymentId)
    .where('c.user_id', '=', userId)
    .executeTakeFirst();
};

export const createCreditCardStatementPaymentsRepository = (
  db: Kysely<FortunaDatabase>,
): CreditCardStatementPaymentsRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('credit_card_statement_payments')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findById: async (userId, paymentId) => {
      return getPaymentOwnedByUser(db, userId, paymentId);
    },

    listByStatement: async (userId, statementId, filters = {}) => {
      let query = db
        .selectFrom('credit_card_statement_payments as p')
        .innerJoin('credit_card_statements as s', 's.id', 'p.credit_card_statement_id')
        .innerJoin('credit_cards as c', 'c.id', 's.credit_card_id')
        .selectAll('p')
        .where('c.user_id', '=', userId)
        .where('p.credit_card_statement_id', '=', statementId)
        .orderBy('p.date', 'asc')
        .orderBy('p.id', 'asc');

      if (filters.accountId) {
        query = query.where('p.account_id', '=', filters.accountId);
      }

      if (filters.dateFrom) {
        query = query.where('p.date', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('p.date', '<=', filters.dateTo);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, paymentId, payload) => {
      const current = await getPaymentOwnedByUser(db, userId, paymentId);

      if (!current) {
        return undefined;
      }

      if (!hasPatchValues(payload)) {
        return current;
      }

      return db
        .updateTable('credit_card_statement_payments')
        .set(payload)
        .where('id', '=', paymentId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, paymentId) => {
      const current = await getPaymentOwnedByUser(db, userId, paymentId);

      if (!current) {
        return false;
      }

      const result = await db
        .deleteFrom('credit_card_statement_payments')
        .where('id', '=', paymentId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
