import type { NewRecurringTransaction, RecurringTransaction,RecurringTransactionUpdate } from '@db/schema';

class RecurringTransactionsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.recurringTransactions.list(input);
  }

  listAll(): Promise<RecurringTransaction[]> {
    return window.fortuna.recurringTransactions.listAll() as Promise<RecurringTransaction[]>;
  }

  findOne(id: number): Promise<RecurringTransaction | undefined> {
    return window.fortuna.recurringTransactions.findOne(id) as Promise<RecurringTransaction | undefined>;
  }

  add(input: NewRecurringTransaction): Promise<RecurringTransaction> {
    return window.fortuna.recurringTransactions.add(input) as Promise<RecurringTransaction>;
  }

  change(input: { id: number; changes: Partial<RecurringTransactionUpdate> }): Promise<RecurringTransaction | undefined> {
    return window.fortuna.recurringTransactions.change(input) as Promise<RecurringTransaction | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.recurringTransactions.remove(id) as Promise<boolean>;
  }
}

export const recurringTransactionsService = new RecurringTransactionsService();
