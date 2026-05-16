import type { NewRecurringTransaction, RecurringTransactionResponse, RecurringTransactionUpdate } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { RecurringTransactionsListFilters, RecurringTransactionsPort } from '../ports.js';

export const createRecurringTransactionsUseCases = (recurringTransactions: RecurringTransactionsPort) => ({
  create: (payload: NewRecurringTransaction): Promise<RecurringTransactionResponse> => recurringTransactions.create(payload),
  findById: async (userId: number, recurringTransactionId: number): Promise<RecurringTransactionResponse> => {
    const item = await recurringTransactions.findById(userId, recurringTransactionId);
    if (!item) throw new DomainError({ code: 'RECURRING_TRANSACTION_NOT_FOUND', message: 'Recurring transaction not found.' });
    return item;
  },
  listByUser: (userId: number, filters: RecurringTransactionsListFilters): Promise<RecurringTransactionResponse[]> => recurringTransactions.listByUser(userId, filters),
  updateById: async (userId: number, recurringTransactionId: number, payload: RecurringTransactionUpdate): Promise<RecurringTransactionResponse> => {
    const item = await recurringTransactions.updateById(userId, recurringTransactionId, payload);
    if (!item) throw new DomainError({ code: 'RECURRING_TRANSACTION_NOT_FOUND', message: 'Recurring transaction not found.' });
    return item;
  },
  deleteById: async (userId: number, recurringTransactionId: number): Promise<void> => {
    const deleted = await recurringTransactions.deleteById(userId, recurringTransactionId);
    if (!deleted) throw new DomainError({ code: 'RECURRING_TRANSACTION_NOT_FOUND', message: 'Recurring transaction not found.' });
  },
});
