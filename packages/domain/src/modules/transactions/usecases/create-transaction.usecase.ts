import type { TransactionResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { TransactionCreateInput, TransactionsPort } from '../ports.js';

export interface CreateTransactionUseCaseDeps {
  transactions: TransactionsPort;
}

export const createCreateTransactionUseCase = (deps: CreateTransactionUseCaseDeps) => {
  return async (input: TransactionCreateInput): Promise<TransactionResponse> => {
    if (input.amount <= 0) {
      throw new DomainError({
        code: 'TRANSACTION_INVALID_AMOUNT',
        message: 'Transaction amount must be greater than zero.',
      });
    }

    return deps.transactions.create(input);
  };
};
