import type { AccountResponse, AccountUpdate, NewAccount } from '@repo/shared';

export interface AccountsListFilters {
  limit?: number;
  offset?: number;
  accountTypeId?: number;
}

export interface AccountsPort {
  create(payload: NewAccount): Promise<AccountResponse>;
  findById(userId: number, accountId: number): Promise<AccountResponse | undefined>;
  listByUser(userId: number, filters?: AccountsListFilters): Promise<AccountResponse[]>;
  updateById(userId: number, accountId: number, payload: AccountUpdate): Promise<AccountResponse | undefined>;
  deleteById(userId: number, accountId: number): Promise<boolean>;
  getCurrentBalance(userId: number, accountId: number): Promise<number | undefined>;
}
