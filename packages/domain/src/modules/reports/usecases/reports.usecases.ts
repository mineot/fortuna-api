import { DomainError } from '../../../errors/domain-error.js';
import type { ReportsPort } from '../ports.js';

export const createReportsUseCases = (reports: ReportsPort) => ({
  getSummary: async (
    userId: number,
    query: { date_from?: string | undefined; date_to?: string | undefined },
  ) => {
    const summary = await reports.getUserFinanceSummary(userId, {
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
    const balances = await reports.getAccountBalancesByUser(userId);

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
    const statementBalance = await reports.getStatementBalance(userId, statementId);

    if (!statementBalance) {
      throw new DomainError({
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
