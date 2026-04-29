import type { AccountType,AccountTypeUpdate, NewAccountType } from '@db/schema';

class AccountTypesService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.accountTypes.list(input);
  }

  listAll(): Promise<AccountType[]> {
    return window.fortuna.accountTypes.listAll() as Promise<AccountType[]>;
  }

  findOne(id: number): Promise<AccountType | undefined> {
    return window.fortuna.accountTypes.findOne(id) as Promise<AccountType | undefined>;
  }

  add(input: NewAccountType): Promise<AccountType> {
    return window.fortuna.accountTypes.add(input) as Promise<AccountType>;
  }

  change(input: { id: number; changes: Partial<AccountTypeUpdate> }): Promise<AccountType | undefined> {
    return window.fortuna.accountTypes.change(input) as Promise<AccountType | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.accountTypes.remove(id) as Promise<boolean>;
  }
}

export const accountTypesService = new AccountTypesService();
