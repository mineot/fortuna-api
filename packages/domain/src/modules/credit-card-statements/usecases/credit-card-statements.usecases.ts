import type { CreditCardStatementResponse, CreditCardStatementUpdate, NewCreditCardStatement } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CreditCardStatementsListFilters, CreditCardStatementsPort } from '../ports.js';

export const createCreditCardStatementsUseCases = (creditCardStatements: CreditCardStatementsPort) => ({
  create: (payload: NewCreditCardStatement): Promise<CreditCardStatementResponse> =>
    creditCardStatements.create(payload),
  findById: async (userId: number, statementId: number): Promise<CreditCardStatementResponse> => {
    const statement = await creditCardStatements.findById(userId, statementId);
    if (!statement) {
      throw new DomainError({
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }
    return statement;
  },
  listByCard: (
    userId: number,
    creditCardId: number,
    filters: CreditCardStatementsListFilters,
  ): Promise<CreditCardStatementResponse[]> => creditCardStatements.listByCard(userId, creditCardId, filters),
  updateById: async (
    userId: number,
    statementId: number,
    payload: CreditCardStatementUpdate,
  ): Promise<CreditCardStatementResponse> => {
    const statement = await creditCardStatements.updateById(userId, statementId, payload);
    if (!statement) {
      throw new DomainError({
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }
    return statement;
  },
  deleteById: async (userId: number, statementId: number): Promise<void> => {
    const deleted = await creditCardStatements.deleteById(userId, statementId);
    if (!deleted) {
      throw new DomainError({
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }
  },
  getTotals: async (userId: number, statementId: number) => {
    const [statementTotal, statementPaidTotal] = await Promise.all([
      creditCardStatements.getStatementTotal(userId, statementId),
      creditCardStatements.getStatementPaidTotal(userId, statementId),
    ]);

    if (statementTotal === undefined || statementPaidTotal === undefined) {
      throw new DomainError({
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }

    return {
      statement_total: statementTotal,
      statement_paid_total: statementPaidTotal,
      statement_remaining_total: statementTotal - statementPaidTotal,
    };
  },
});
