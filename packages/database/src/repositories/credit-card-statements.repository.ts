import type {
  CreditCardStatement,
  CreditCardStatementPayment,
  CreditCardStatementStatus,
  CreditCardStatementUpdate,
  Database as FortunaDatabase,
  NewCreditCardStatement,
  Transaction,
  TransactionStatus,
} from '@repo/shared';
import { sql, type Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface CreditCardStatementListFilters {
  status?: CreditCardStatementStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
  limit?: number;
  offset?: number;
}

export interface RegisterStatementPaymentInput {
  creditCardStatementId: number;
  accountId: number;
  amount: number;
  date: string;
  categoryId: number;
  description: string;
  payeeId: number | null;
  notes: string | null;
  transactionStatus?: TransactionStatus;
}

export interface RegisterStatementPaymentResult {
  payment: CreditCardStatementPayment;
  transaction: Transaction;
  statementTotal: number;
  statementPaidTotal: number;
  statementStatus: CreditCardStatementStatus;
}

export interface CreditCardStatementsRepository {
  create: (payload: NewCreditCardStatement) => Promise<CreditCardStatement>;
  findById: (userId: number, statementId: number) => Promise<CreditCardStatement | undefined>;
  listByCard: (
    userId: number,
    creditCardId: number,
    filters?: CreditCardStatementListFilters,
  ) => Promise<CreditCardStatement[]>;
  updateById: (
    userId: number,
    statementId: number,
    payload: CreditCardStatementUpdate,
  ) => Promise<CreditCardStatement | undefined>;
  deleteById: (userId: number, statementId: number) => Promise<boolean>;
  getStatementTotal: (userId: number, statementId: number) => Promise<number | undefined>;
  getStatementPaidTotal: (userId: number, statementId: number) => Promise<number | undefined>;
  registerPayment: (
    userId: number,
    payload: RegisterStatementPaymentInput,
  ) => Promise<RegisterStatementPaymentResult>;
}

const getStatementOwnedByUser = async (
  db: Kysely<FortunaDatabase>,
  userId: number,
  statementId: number,
): Promise<CreditCardStatement | undefined> => {
  return db
    .selectFrom('credit_card_statements as s')
    .innerJoin('credit_cards as c', 'c.id', 's.credit_card_id')
    .selectAll('s')
    .where('s.id', '=', statementId)
    .where('c.user_id', '=', userId)
    .executeTakeFirst();
};

const sumStatementInstallments = async (
  db: Kysely<FortunaDatabase>,
  statementId: number,
): Promise<number> => {
  const row = await db
    .selectFrom('credit_card_installments')
    .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
    .where('credit_card_statement_id', '=', statementId)
    .executeTakeFirstOrThrow();

  return toNumber(row.total);
};

const sumStatementPayments = async (
  db: Kysely<FortunaDatabase>,
  statementId: number,
): Promise<number> => {
  const row = await db
    .selectFrom('credit_card_statement_payments')
    .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
    .where('credit_card_statement_id', '=', statementId)
    .executeTakeFirstOrThrow();

  return toNumber(row.total);
};

export const createCreditCardStatementsRepository = (
  db: Kysely<FortunaDatabase>,
): CreditCardStatementsRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('credit_card_statements')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findById: async (userId, statementId) => {
      return getStatementOwnedByUser(db, userId, statementId);
    },

    listByCard: async (userId, creditCardId, filters = {}) => {
      let query = db
        .selectFrom('credit_card_statements as s')
        .innerJoin('credit_cards as c', 'c.id', 's.credit_card_id')
        .selectAll('s')
        .where('c.user_id', '=', userId)
        .where('s.credit_card_id', '=', creditCardId)
        .orderBy('s.due_date', 'desc')
        .orderBy('s.id', 'desc');

      if (filters.status) {
        query = query.where('s.status', '=', filters.status);
      }

      if (filters.dueDateFrom) {
        query = query.where('s.due_date', '>=', filters.dueDateFrom);
      }

      if (filters.dueDateTo) {
        query = query.where('s.due_date', '<=', filters.dueDateTo);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, statementId, payload) => {
      const current = await getStatementOwnedByUser(db, userId, statementId);

      if (!current) {
        return undefined;
      }

      if (!hasPatchValues(payload)) {
        return current;
      }

      return db
        .updateTable('credit_card_statements')
        .set(payload)
        .where('id', '=', statementId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, statementId) => {
      const current = await getStatementOwnedByUser(db, userId, statementId);

      if (!current) {
        return false;
      }

      const result = await db
        .deleteFrom('credit_card_statements')
        .where('id', '=', statementId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },

    getStatementTotal: async (userId, statementId) => {
      const statement = await getStatementOwnedByUser(db, userId, statementId);

      if (!statement) {
        return undefined;
      }

      return sumStatementInstallments(db, statementId);
    },

    getStatementPaidTotal: async (userId, statementId) => {
      const statement = await getStatementOwnedByUser(db, userId, statementId);

      if (!statement) {
        return undefined;
      }

      return sumStatementPayments(db, statementId);
    },

    registerPayment: async (userId, payload) => {
      const statement = await getStatementOwnedByUser(db, userId, payload.creditCardStatementId);

      if (!statement) {
        throw new Error(
          `Credit card statement ${payload.creditCardStatementId} does not belong to user ${userId}.`,
        );
      }

      const account = await db
        .selectFrom('accounts')
        .select('id')
        .where('id', '=', payload.accountId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (!account) {
        throw new Error(`Account ${payload.accountId} does not belong to user ${userId}.`);
      }

      return db.transaction().execute(async (trx) => {
        const transaction = await trx
          .insertInto('transactions')
          .values({
            user_id: userId,
            account_id: payload.accountId,
            category_id: payload.categoryId,
            payee_id: payload.payeeId,
            type: 'expense',
            description: payload.description,
            amount: payload.amount,
            date: payload.date,
            status: payload.transactionStatus ?? 'confirmed',
            notes: payload.notes,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        const payment = await trx
          .insertInto('credit_card_statement_payments')
          .values({
            credit_card_statement_id: payload.creditCardStatementId,
            account_id: payload.accountId,
            amount: payload.amount,
            date: payload.date,
            transaction_id: transaction.id,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        const [statementTotal, statementPaidTotal] = await Promise.all([
          sumStatementInstallments(trx, payload.creditCardStatementId),
          sumStatementPayments(trx, payload.creditCardStatementId),
        ]);

        const nextStatus: CreditCardStatementStatus =
          statementPaidTotal >= statementTotal ? 'paid' : statement.status;

        if (nextStatus !== statement.status) {
          await trx
            .updateTable('credit_card_statements')
            .set({ status: nextStatus })
            .where('id', '=', payload.creditCardStatementId)
            .execute();
        }

        return {
          payment,
          transaction,
          statementTotal,
          statementPaidTotal,
          statementStatus: nextStatus,
        };
      });
    },
  };
};
