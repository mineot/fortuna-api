import type {
  CreditCardInstallment,
  CreditCardInstallmentUpdate,
  Database as FortunaDatabase,
  NewCreditCardInstallment,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface CreditCardInstallmentListFilters {
  statementId?: number;
  competenceDateFrom?: string;
  competenceDateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreditCardInstallmentsRepository {
  create: (payload: NewCreditCardInstallment) => Promise<CreditCardInstallment>;
  findById: (userId: number, installmentId: number) => Promise<CreditCardInstallment | undefined>;
  listByPurchase: (
    userId: number,
    purchaseId: number,
    filters?: CreditCardInstallmentListFilters,
  ) => Promise<CreditCardInstallment[]>;
  updateById: (
    userId: number,
    installmentId: number,
    payload: CreditCardInstallmentUpdate,
  ) => Promise<CreditCardInstallment | undefined>;
  deleteById: (userId: number, installmentId: number) => Promise<boolean>;
}

const getInstallmentOwnedByUser = async (
  db: Kysely<FortunaDatabase>,
  userId: number,
  installmentId: number,
): Promise<CreditCardInstallment | undefined> => {
  return db
    .selectFrom('credit_card_installments as i')
    .innerJoin('credit_card_purchases as p', 'p.id', 'i.credit_card_purchase_id')
    .innerJoin('credit_cards as c', 'c.id', 'p.credit_card_id')
    .selectAll('i')
    .where('i.id', '=', installmentId)
    .where('c.user_id', '=', userId)
    .executeTakeFirst();
};

export const createCreditCardInstallmentsRepository = (
  db: Kysely<FortunaDatabase>,
): CreditCardInstallmentsRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('credit_card_installments')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findById: async (userId, installmentId) => {
      return getInstallmentOwnedByUser(db, userId, installmentId);
    },

    listByPurchase: async (userId, purchaseId, filters = {}) => {
      let query = db
        .selectFrom('credit_card_installments as i')
        .innerJoin('credit_card_purchases as p', 'p.id', 'i.credit_card_purchase_id')
        .innerJoin('credit_cards as c', 'c.id', 'p.credit_card_id')
        .selectAll('i')
        .where('c.user_id', '=', userId)
        .where('i.credit_card_purchase_id', '=', purchaseId)
        .orderBy('i.installment_number', 'asc');

      if (filters.statementId) {
        query = query.where('i.credit_card_statement_id', '=', filters.statementId);
      }

      if (filters.competenceDateFrom) {
        query = query.where('i.competence_date', '>=', filters.competenceDateFrom);
      }

      if (filters.competenceDateTo) {
        query = query.where('i.competence_date', '<=', filters.competenceDateTo);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, installmentId, payload) => {
      const current = await getInstallmentOwnedByUser(db, userId, installmentId);

      if (!current) {
        return undefined;
      }

      if (!hasPatchValues(payload)) {
        return current;
      }

      return db
        .updateTable('credit_card_installments')
        .set(payload)
        .where('id', '=', installmentId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, installmentId) => {
      const current = await getInstallmentOwnedByUser(db, userId, installmentId);

      if (!current) {
        return false;
      }

      const result = await db
        .deleteFrom('credit_card_installments')
        .where('id', '=', installmentId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
