import type { NewTransaction, Transaction, TransactionUpdate } from '@db/schema';

import { CrudService } from './crud.service';

class TransactionsService extends CrudService<Transaction, NewTransaction, TransactionUpdate> {
  constructor() {
    super(window.fortuna.transactions);
  }
}

export const transactionsService = new TransactionsService();
