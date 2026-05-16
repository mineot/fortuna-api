import type { CreditCardStatementStatus } from '@repo/shared';

export interface ReportsSummaryResult {
  incomeTotal: number;
  expenseTotal: number;
  netFlow: number;
  confirmedTransfersIn: number;
  confirmedTransfersOut: number;
}

export interface ReportsAccountBalanceResult {
  accountId: number;
  accountName: string;
  initialBalance: number;
  confirmedIncome: number;
  confirmedExpense: number;
  confirmedTransfersIn: number;
  confirmedTransfersOut: number;
  currentBalance: number;
}

export interface ReportsStatementBalanceResult {
  statementId: number;
  status: CreditCardStatementStatus;
  statementTotal: number;
  paidTotal: number;
  remainingAmount: number;
}

export interface ReportsPort {
  getUserFinanceSummary(userId: number, filters?: { dateFrom?: string; dateTo?: string }): Promise<ReportsSummaryResult>;
  getAccountBalancesByUser(userId: number): Promise<ReportsAccountBalanceResult[]>;
  getStatementBalance(userId: number, statementId: number): Promise<ReportsStatementBalanceResult | undefined>;
}
