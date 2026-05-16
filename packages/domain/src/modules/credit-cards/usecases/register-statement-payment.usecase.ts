import type { TransactionStatus } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { CreditCardsPort, RegisterStatementPaymentResult } from '../ports.js';

export interface RegisterStatementPaymentInput {
  userId: number;
  statementId: number;
  accountId: number;
  amount: number;
  date: string;
  categoryId: number;
  description: string;
  payeeId: number | null;
  notes: string | null;
  transactionStatus?: TransactionStatus | undefined;
}

export interface RegisterStatementPaymentUseCaseDeps {
  creditCards: CreditCardsPort;
}

export const createRegisterStatementPaymentUseCase = (
  deps: RegisterStatementPaymentUseCaseDeps,
) => {
  return async (input: RegisterStatementPaymentInput): Promise<RegisterStatementPaymentResult> => {
    if (input.amount <= 0) {
      throw new DomainError({
        code: 'CREDIT_CARD_STATEMENT_PAYMENT_INVALID_AMOUNT',
        message: 'Statement payment amount must be greater than zero.',
      });
    }

    try {
      return await deps.creditCards.registerStatementPayment(input.userId, {
        creditCardStatementId: input.statementId,
        accountId: input.accountId,
        amount: input.amount,
        date: input.date,
        categoryId: input.categoryId,
        description: input.description,
        payeeId: input.payeeId,
        notes: input.notes,
        ...(input.transactionStatus !== undefined ? { transactionStatus: input.transactionStatus } : {}),
      });
    } catch (error) {
      throw new DomainError({
        code: 'CREDIT_CARD_STATEMENT_PAYMENT_ERROR',
        message: error instanceof Error ? error.message : 'Could not register statement payment.',
      });
    }
  };
};
