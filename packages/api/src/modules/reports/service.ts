import { DomainError } from '../../lib/errors.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface ReportsSummaryQuery {
  date_from?: string | undefined;
  date_to?: string | undefined;
}

export const createReportsService = (repositories: ApiRepositories) => ({
  getSummary: async (userId: number, query: ReportsSummaryQuery) => {
    const summary = await repositories.reports.getUserFinanceSummary(userId, {
      ...(query.date_from !== undefined ? { dateFrom: query.date_from } : {}),
      ...(query.date_to !== undefined ? { dateTo: query.date_to } : {}),
    });

    return {
      income_total: summary.incomeTotal,
      expense_total: summary.expenseTotal,
      net_flow: summary.netFlow,
      confirmed_transfers_in: summary.confirmedTransfersIn,
      confirmed_transfers_out: summary.confirmedTransfersOut,
    };
  },

  getAccountBalances: async (userId: number) => {
    const balances = await repositories.reports.getAccountBalancesByUser(userId);

    return balances.map((balance) => ({
      account_id: balance.accountId,
      account_name: balance.accountName,
      initial_balance: balance.initialBalance,
      confirmed_income: balance.confirmedIncome,
      confirmed_expense: balance.confirmedExpense,
      confirmed_transfers_in: balance.confirmedTransfersIn,
      confirmed_transfers_out: balance.confirmedTransfersOut,
      current_balance: balance.currentBalance,
    }));
  },

  getStatementBalance: async (userId: number, statementId: number) => {
    const statementBalance = await repositories.reports.getStatementBalance(userId, statementId);

    if (!statementBalance) {
      throw new DomainError(404, {
        code: 'STATEMENT_BALANCE_NOT_FOUND',
        message: 'Statement balance not found.',
      });
    }

    return {
      statement_id: statementBalance.statementId,
      status: statementBalance.status,
      statement_total: statementBalance.statementTotal,
      paid_total: statementBalance.paidTotal,
      remaining_amount: statementBalance.remainingAmount,
    };
  },
});
