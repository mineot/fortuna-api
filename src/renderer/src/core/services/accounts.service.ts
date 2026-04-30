import type { Account,AccountUpdate, NewAccount } from '@db/schema';

class AccountsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.accounts.list(input);
  }

  listAll(): Promise<Account[]> {
    return window.fortuna.accounts.listAll() as Promise<Account[]>;
  }

  findOne(id: number): Promise<Account | undefined> {
    return window.fortuna.accounts.findOne(id) as Promise<Account | undefined>;
  }

  add(input: NewAccount): Promise<Account> {
    return window.fortuna.accounts.add(input) as Promise<Account>;
  }

  change(input: { id: number; changes: Partial<AccountUpdate> }): Promise<Account | undefined> {
    return window.fortuna.accounts.change(input) as Promise<Account | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.accounts.remove(id) as Promise<boolean>;
  }
}

export const accountsService = new AccountsService();
