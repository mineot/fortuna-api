import type {
  CreditCard,
  CreditCardInstallment,
  CreditCardInstallmentUpdate,
  CreditCardPurchase,
  CreditCardPurchaseUpdate,
  CreditCardStatement,
  CreditCardStatementPayment,
  CreditCardStatementPaymentUpdate,
  CreditCardStatementUpdate,
  CreditCardUpdate,
  NewCreditCard,
  NewCreditCardInstallment,
  NewCreditCardPurchase,
  NewCreditCardStatement,
  NewCreditCardStatementPayment,
} from '@repo/shared';

import type { DatabaseClient } from '../../client';

const hasAffectedRows = (value: bigint | number): boolean => Number(value) > 0;

export interface CreditCardsRepository {
  createCreditCard(input: NewCreditCard): Promise<CreditCard>;
  findCreditCardById(id: number): Promise<CreditCard | undefined>;
  listCreditCardsByUserId(userId: number): Promise<CreditCard[]>;
  updateCreditCardById(id: number, patch: CreditCardUpdate): Promise<CreditCard | undefined>;
  deleteCreditCardById(id: number): Promise<boolean>;

  createStatement(input: NewCreditCardStatement): Promise<CreditCardStatement>;
  findStatementById(id: number): Promise<CreditCardStatement | undefined>;
  listStatementsByCardId(creditCardId: number): Promise<CreditCardStatement[]>;
  updateStatementById(
    id: number,
    patch: CreditCardStatementUpdate,
  ): Promise<CreditCardStatement | undefined>;
  deleteStatementById(id: number): Promise<boolean>;

  createPurchase(input: NewCreditCardPurchase): Promise<CreditCardPurchase>;
  findPurchaseById(id: number): Promise<CreditCardPurchase | undefined>;
  listPurchasesByCardId(creditCardId: number): Promise<CreditCardPurchase[]>;
  updatePurchaseById(
    id: number,
    patch: CreditCardPurchaseUpdate,
  ): Promise<CreditCardPurchase | undefined>;
  deletePurchaseById(id: number): Promise<boolean>;

  createInstallment(input: NewCreditCardInstallment): Promise<CreditCardInstallment>;
  findInstallmentById(id: number): Promise<CreditCardInstallment | undefined>;
  listInstallmentsByStatementId(creditCardStatementId: number): Promise<CreditCardInstallment[]>;
  updateInstallmentById(
    id: number,
    patch: CreditCardInstallmentUpdate,
  ): Promise<CreditCardInstallment | undefined>;
  deleteInstallmentById(id: number): Promise<boolean>;

  createStatementPayment(input: NewCreditCardStatementPayment): Promise<CreditCardStatementPayment>;
  findStatementPaymentById(id: number): Promise<CreditCardStatementPayment | undefined>;
  listStatementPaymentsByStatementId(
    creditCardStatementId: number,
  ): Promise<CreditCardStatementPayment[]>;
  updateStatementPaymentById(
    id: number,
    patch: CreditCardStatementPaymentUpdate,
  ): Promise<CreditCardStatementPayment | undefined>;
  deleteStatementPaymentById(id: number): Promise<boolean>;
}

export const createCreditCardsRepository = (db: DatabaseClient): CreditCardsRepository => ({
  async createCreditCard(input) {
    return db.insertInto('credit_cards').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findCreditCardById(id) {
    return db.selectFrom('credit_cards').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listCreditCardsByUserId(userId) {
    return db
      .selectFrom('credit_cards')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('id', 'asc')
      .execute();
  },

  async updateCreditCardById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findCreditCardById(id);
    }

    return db
      .updateTable('credit_cards')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteCreditCardById(id) {
    const result = await db.deleteFrom('credit_cards').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createStatement(input) {
    return db
      .insertInto('credit_card_statements')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async findStatementById(id) {
    return db
      .selectFrom('credit_card_statements')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },

  async listStatementsByCardId(creditCardId) {
    return db
      .selectFrom('credit_card_statements')
      .selectAll()
      .where('credit_card_id', '=', creditCardId)
      .orderBy('due_date', 'desc')
      .orderBy('id', 'desc')
      .execute();
  },

  async updateStatementById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findStatementById(id);
    }

    return db
      .updateTable('credit_card_statements')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteStatementById(id) {
    const result = await db
      .deleteFrom('credit_card_statements')
      .where('id', '=', id)
      .executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createPurchase(input) {
    return db
      .insertInto('credit_card_purchases')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async findPurchaseById(id) {
    return db
      .selectFrom('credit_card_purchases')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },

  async listPurchasesByCardId(creditCardId) {
    return db
      .selectFrom('credit_card_purchases')
      .selectAll()
      .where('credit_card_id', '=', creditCardId)
      .orderBy('purchase_date', 'desc')
      .orderBy('id', 'desc')
      .execute();
  },

  async updatePurchaseById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findPurchaseById(id);
    }

    return db
      .updateTable('credit_card_purchases')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deletePurchaseById(id) {
    const result = await db
      .deleteFrom('credit_card_purchases')
      .where('id', '=', id)
      .executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createInstallment(input) {
    return db
      .insertInto('credit_card_installments')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async findInstallmentById(id) {
    return db
      .selectFrom('credit_card_installments')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },

  async listInstallmentsByStatementId(creditCardStatementId) {
    return db
      .selectFrom('credit_card_installments')
      .selectAll()
      .where('credit_card_statement_id', '=', creditCardStatementId)
      .orderBy('installment_number', 'asc')
      .execute();
  },

  async updateInstallmentById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findInstallmentById(id);
    }

    return db
      .updateTable('credit_card_installments')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteInstallmentById(id) {
    const result = await db
      .deleteFrom('credit_card_installments')
      .where('id', '=', id)
      .executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createStatementPayment(input) {
    return db
      .insertInto('credit_card_statement_payments')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async findStatementPaymentById(id) {
    return db
      .selectFrom('credit_card_statement_payments')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },

  async listStatementPaymentsByStatementId(creditCardStatementId) {
    return db
      .selectFrom('credit_card_statement_payments')
      .selectAll()
      .where('credit_card_statement_id', '=', creditCardStatementId)
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .execute();
  },

  async updateStatementPaymentById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findStatementPaymentById(id);
    }

    return db
      .updateTable('credit_card_statement_payments')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteStatementPaymentById(id) {
    const result = await db
      .deleteFrom('credit_card_statement_payments')
      .where('id', '=', id)
      .executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },
});
