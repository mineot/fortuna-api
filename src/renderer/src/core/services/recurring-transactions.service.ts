import type { NewRecurringTransaction, RecurringTransaction, RecurringTransactionUpdate } from '@db/schema';

import { CrudService } from './crud.service';

class RecurringTransactionsService extends CrudService<RecurringTransaction, NewRecurringTransaction, RecurringTransactionUpdate> {
  constructor() {
    super(window.fortuna.recurringTransactions);
  }
}

export const recurringTransactionsService = new RecurringTransactionsService();
