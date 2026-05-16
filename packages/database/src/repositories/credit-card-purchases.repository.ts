import type {
  CreditCardInstallment,
  CreditCardPurchase,
  CreditCardPurchaseUpdate,
  Database as FortunaDatabase,
  NewCreditCardInstallment,
  NewCreditCardPurchase,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils.js';

export interface CreditCardPurchaseListFilters {
  categoryId?: number;
  payeeId?: number;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  limit?: number;
  offset?: number;
}

export type NewInstallmentInput = Omit<NewCreditCardInstallment, 'credit_card_purchase_id'>;

export interface PurchaseWithInstallments {
  purchase: CreditCardPurchase;
  installments: CreditCardInstallment[];
}

export interface CreditCardPurchasesRepository {
  create: (payload: NewCreditCardPurchase) => Promise<CreditCardPurchase>;
  createWithInstallments: (
    userId: number,
    purchase: NewCreditCardPurchase,
    installments: NewInstallmentInput[],
  ) => Promise<PurchaseWithInstallments>;
  findById: (userId: number, purchaseId: number) => Promise<CreditCardPurchase | undefined>;
  listByCard: (
    userId: number,
    creditCardId: number,
    filters?: CreditCardPurchaseListFilters,
  ) => Promise<CreditCardPurchase[]>;
  updateById: (
    userId: number,
    purchaseId: number,
    payload: CreditCardPurchaseUpdate,
  ) => Promise<CreditCardPurchase | undefined>;
  deleteById: (userId: number, purchaseId: number) => Promise<boolean>;
}

const assertCreditCardOwnership = async (
  db: Kysely<FortunaDatabase>,
  userId: number,
  creditCardId: number,
): Promise<void> => {
  const card = await db
    .selectFrom('credit_cards')
    .select('id')
    .where('id', '=', creditCardId)
    .where('user_id', '=', userId)
    .executeTakeFirst();

  if (!card) {
    throw new Error(`Credit card ${creditCardId} does not belong to user ${userId}.`);
  }
};

const getPurchaseOwnedByUser = async (
  db: Kysely<FortunaDatabase>,
  userId: number,
  purchaseId: number,
): Promise<CreditCardPurchase | undefined> => {
  return db
    .selectFrom('credit_card_purchases as p')
    .innerJoin('credit_cards as c', 'c.id', 'p.credit_card_id')
    .selectAll('p')
    .where('p.id', '=', purchaseId)
    .where('c.user_id', '=', userId)
    .executeTakeFirst();
};

export const createCreditCardPurchasesRepository = (
  db: Kysely<FortunaDatabase>,
): CreditCardPurchasesRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('credit_card_purchases')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    createWithInstallments: async (userId, purchase, installments) => {
      await assertCreditCardOwnership(db, userId, purchase.credit_card_id);

      if (installments.length !== purchase.installment_count) {
        throw new Error(
          `Installment count mismatch: purchase.installment_count=${purchase.installment_count}, installments.length=${installments.length}.`,
        );
      }

      const totalInstallmentsAmount = installments.reduce((acc, item) => acc + item.amount, 0);

      if (totalInstallmentsAmount !== purchase.total_amount) {
        throw new Error(
          `Installment sum mismatch: installments total ${totalInstallmentsAmount} differs from purchase total ${purchase.total_amount}.`,
        );
      }

      return db.transaction().execute(async (trx) => {
        const createdPurchase = await trx
          .insertInto('credit_card_purchases')
          .values(purchase)
          .returningAll()
          .executeTakeFirstOrThrow();

        const createdInstallments = await trx
          .insertInto('credit_card_installments')
          .values(
            installments.map((installment) => ({
              ...installment,
              credit_card_purchase_id: createdPurchase.id,
            })),
          )
          .returningAll()
          .execute();

        return {
          purchase: createdPurchase,
          installments: createdInstallments,
        };
      });
    },

    findById: async (userId, purchaseId) => {
      return getPurchaseOwnedByUser(db, userId, purchaseId);
    },

    listByCard: async (userId, creditCardId, filters = {}) => {
      let query = db
        .selectFrom('credit_card_purchases as p')
        .innerJoin('credit_cards as c', 'c.id', 'p.credit_card_id')
        .selectAll('p')
        .where('c.user_id', '=', userId)
        .where('p.credit_card_id', '=', creditCardId)
        .orderBy('p.purchase_date', 'desc')
        .orderBy('p.id', 'desc');

      if (filters.categoryId) {
        query = query.where('p.category_id', '=', filters.categoryId);
      }

      if (typeof filters.payeeId === 'number') {
        query = query.where('p.payee_id', '=', filters.payeeId);
      }

      if (filters.purchaseDateFrom) {
        query = query.where('p.purchase_date', '>=', filters.purchaseDateFrom);
      }

      if (filters.purchaseDateTo) {
        query = query.where('p.purchase_date', '<=', filters.purchaseDateTo);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, purchaseId, payload) => {
      const current = await getPurchaseOwnedByUser(db, userId, purchaseId);

      if (!current) {
        return undefined;
      }

      if (!hasPatchValues(payload)) {
        return current;
      }

      return db
        .updateTable('credit_card_purchases')
        .set(payload)
        .where('id', '=', purchaseId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, purchaseId) => {
      const current = await getPurchaseOwnedByUser(db, userId, purchaseId);

      if (!current) {
        return false;
      }

      const result = await db
        .deleteFrom('credit_card_purchases')
        .where('id', '=', purchaseId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
