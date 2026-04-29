import type { NewTransaction, Transaction,TransactionUpdate } from '@db/schema';

class TransactionsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.transactions.list(input);
  }

  listAll(): Promise<Transaction[]> {
    return window.fortuna.transactions.listAll() as Promise<Transaction[]>;
  }

  findOne(id: number): Promise<Transaction | undefined> {
    return window.fortuna.transactions.findOne(id) as Promise<Transaction | undefined>;
  }

  add(input: NewTransaction): Promise<Transaction> {
    return window.fortuna.transactions.add(input) as Promise<Transaction>;
  }

  change(input: { id: number; changes: Partial<TransactionUpdate> }): Promise<Transaction | undefined> {
    return window.fortuna.transactions.change(input) as Promise<Transaction | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.transactions.remove(id) as Promise<boolean>;
  }
}

export const transactionsService = new TransactionsService();
