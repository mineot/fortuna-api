import type { CreditCardStatementStatus, Database as FortunaDatabase } from '@repo/shared';
import { sql, type Kysely } from 'kysely';

import { toNumber } from './utils.js';

export interface PeriodFilter {
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFinanceSummary {
  incomeTotal: number;
  expenseTotal: number;
  netFlow: number;
  confirmedTransfersIn: number;
  confirmedTransfersOut: number;
}

export interface AccountBalanceReport {
  accountId: number;
  accountName: string;
  initialBalance: number;
  confirmedIncome: number;
  confirmedExpense: number;
  confirmedTransfersIn: number;
  confirmedTransfersOut: number;
  currentBalance: number;
}

export interface StatementBalanceReport {
  statementId: number;
  status: CreditCardStatementStatus;
  statementTotal: number;
  paidTotal: number;
  remainingAmount: number;
}

export interface ReportsRepository {
  getUserFinanceSummary: (userId: number, filter?: PeriodFilter) => Promise<UserFinanceSummary>;
  getAccountBalancesByUser: (userId: number) => Promise<AccountBalanceReport[]>;
  getStatementBalance: (
    userId: number,
    statementId: number,
  ) => Promise<StatementBalanceReport | undefined>;
}

const applyDateRangeOnTransactions = <T>(query: T, filter: PeriodFilter): T => {
  let nextQuery = query as T & {
    where: (column: string, op: '>=' | '<=', value: string) => typeof query;
  };

  if (filter.dateFrom) {
    nextQuery = nextQuery.where('date', '>=', filter.dateFrom) as typeof nextQuery;
  }

  if (filter.dateTo) {
    nextQuery = nextQuery.where('date', '<=', filter.dateTo) as typeof nextQuery;
  }

  return nextQuery;
};

const applyDateRangeOnTransfers = <T>(query: T, filter: PeriodFilter): T => {
  let nextQuery = query as T & {
    where: (column: string, op: '>=' | '<=', value: string) => typeof query;
  };

  if (filter.dateFrom) {
    nextQuery = nextQuery.where('date', '>=', filter.dateFrom) as typeof nextQuery;
  }

  if (filter.dateTo) {
    nextQuery = nextQuery.where('date', '<=', filter.dateTo) as typeof nextQuery;
  }

  return nextQuery;
};

export const createReportsRepository = (db: Kysely<FortunaDatabase>): ReportsRepository => {
  return {
    getUserFinanceSummary: async (userId, filter = {}) => {
      const incomeQuery = applyDateRangeOnTransactions(
        db
          .selectFrom('transactions')
          .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
          .where('user_id', '=', userId)
          .where('status', '=', 'confirmed')
          .where('type', '=', 'income'),
        filter,
      );

      const expenseQuery = applyDateRangeOnTransactions(
        db
          .selectFrom('transactions')
          .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
          .where('user_id', '=', userId)
          .where('status', '=', 'confirmed')
          .where('type', '=', 'expense'),
        filter,
      );

      const transfersInQuery = applyDateRangeOnTransfers(
        db
          .selectFrom('transfers as t')
          .innerJoin('accounts as a', 'a.id', 't.destination_account_id')
          .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
          .where('a.user_id', '=', userId)
          .where('t.status', '=', 'confirmed'),
        filter,
      );

      const transfersOutQuery = applyDateRangeOnTransfers(
        db
          .selectFrom('transfers as t')
          .innerJoin('accounts as a', 'a.id', 't.source_account_id')
          .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
          .where('a.user_id', '=', userId)
          .where('t.status', '=', 'confirmed'),
        filter,
      );

      const [incomeRow, expenseRow, transfersInRow, transfersOutRow] = await Promise.all([
        incomeQuery.executeTakeFirstOrThrow(),
        expenseQuery.executeTakeFirstOrThrow(),
        transfersInQuery.executeTakeFirstOrThrow(),
        transfersOutQuery.executeTakeFirstOrThrow(),
      ]);

      const incomeTotal = toNumber(incomeRow.total);
      const expenseTotal = toNumber(expenseRow.total);
      const confirmedTransfersIn = toNumber(transfersInRow.total);
      const confirmedTransfersOut = toNumber(transfersOutRow.total);

      return {
        incomeTotal,
        expenseTotal,
        netFlow: incomeTotal - expenseTotal,
        confirmedTransfersIn,
        confirmedTransfersOut,
      };
    },

    getAccountBalancesByUser: async (userId) => {
      const accounts = await db
        .selectFrom('accounts')
        .select(['id', 'name', 'initial_balance'])
        .where('user_id', '=', userId)
        .orderBy('id', 'asc')
        .execute();

      if (accounts.length === 0) {
        return [];
      }

      const reports: AccountBalanceReport[] = [];

      for (const account of accounts) {
        const [incomeRow, expenseRow, transfersInRow, transfersOutRow] = await Promise.all([
          db
            .selectFrom('transactions')
            .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
            .where('user_id', '=', userId)
            .where('account_id', '=', account.id)
            .where('status', '=', 'confirmed')
            .where('type', '=', 'income')
            .executeTakeFirstOrThrow(),
          db
            .selectFrom('transactions')
            .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
            .where('user_id', '=', userId)
            .where('account_id', '=', account.id)
            .where('status', '=', 'confirmed')
            .where('type', '=', 'expense')
            .executeTakeFirstOrThrow(),
          db
            .selectFrom('transfers')
            .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
            .where('user_id', '=', userId)
            .where('destination_account_id', '=', account.id)
            .where('status', '=', 'confirmed')
            .executeTakeFirstOrThrow(),
          db
            .selectFrom('transfers')
            .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
            .where('user_id', '=', userId)
            .where('source_account_id', '=', account.id)
            .where('status', '=', 'confirmed')
            .executeTakeFirstOrThrow(),
        ]);

        const confirmedIncome = toNumber(incomeRow.total);
        const confirmedExpense = toNumber(expenseRow.total);
        const confirmedTransfersIn = toNumber(transfersInRow.total);
        const confirmedTransfersOut = toNumber(transfersOutRow.total);
        const initialBalance = toNumber(account.initial_balance);

        reports.push({
          accountId: account.id,
          accountName: account.name,
          initialBalance,
          confirmedIncome,
          confirmedExpense,
          confirmedTransfersIn,
          confirmedTransfersOut,
          currentBalance:
            initialBalance +
            confirmedIncome -
            confirmedExpense +
            confirmedTransfersIn -
            confirmedTransfersOut,
        });
      }

      return reports;
    },

    getStatementBalance: async (userId, statementId) => {
      const statement = await db
        .selectFrom('credit_card_statements as s')
        .innerJoin('credit_cards as c', 'c.id', 's.credit_card_id')
        .select(['s.id', 's.status'])
        .where('s.id', '=', statementId)
        .where('c.user_id', '=', userId)
        .executeTakeFirst();

      if (!statement) {
        return undefined;
      }

      const [totalRow, paidRow] = await Promise.all([
        db
          .selectFrom('credit_card_installments')
          .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
          .where('credit_card_statement_id', '=', statementId)
          .executeTakeFirstOrThrow(),
        db
          .selectFrom('credit_card_statement_payments')
          .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amount'), sql.lit(0)).as('total'))
          .where('credit_card_statement_id', '=', statementId)
          .executeTakeFirstOrThrow(),
      ]);

      const statementTotal = toNumber(totalRow.total);
      const paidTotal = toNumber(paidRow.total);

      return {
        statementId: statement.id,
        status: statement.status,
        statementTotal,
        paidTotal,
        remainingAmount: Math.max(statementTotal - paidTotal, 0),
      };
    },
  };
};
