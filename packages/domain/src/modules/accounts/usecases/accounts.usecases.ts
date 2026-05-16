import type { AccountResponse, AccountUpdate, NewAccount } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { AccountsListFilters, AccountsPort } from '../ports.js';

export const createAccountsUseCases = (accounts: AccountsPort) => ({
  create: (payload: NewAccount): Promise<AccountResponse> => accounts.create(payload),
  findById: async (userId: number, accountId: number): Promise<AccountResponse> => {
    const account = await accounts.findById(userId, accountId);
    if (!account) throw new DomainError({ code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.' });
    return account;
  },
  listByUser: (userId: number, filters: AccountsListFilters): Promise<AccountResponse[]> => accounts.listByUser(userId, filters),
  updateById: async (userId: number, accountId: number, payload: AccountUpdate): Promise<AccountResponse> => {
    const account = await accounts.updateById(userId, accountId, payload);
    if (!account) throw new DomainError({ code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.' });
    return account;
  },
  deleteById: async (userId: number, accountId: number): Promise<void> => {
    const deleted = await accounts.deleteById(userId, accountId);
    if (!deleted) throw new DomainError({ code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.' });
  },
  getCurrentBalance: async (userId: number, accountId: number): Promise<number> => {
    const balance = await accounts.getCurrentBalance(userId, accountId);
    if (balance === undefined) throw new DomainError({ code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.' });
    return balance;
  },
});
