import type { AccountResponse, AccountUpdate, CreateAccountDto, UpdateAccountDto } from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface AccountsListQuery extends PaginationInput {
  account_type_id?: number | undefined;
}

type CreateAccountPayload = Omit<CreateAccountDto, 'user_id'>;
type UpdateAccountPayload = Omit<UpdateAccountDto, 'user_id'>;

export const createAccountsService = (repositories: ApiRepositories) => ({
  create: async (userId: number, payload: CreateAccountPayload): Promise<AccountResponse> => {
    return repositories.accounts.create({
      user_id: userId,
      ...payload,
      notes: payload.notes ?? null,
    });
  },

  findById: async (userId: number, accountId: number): Promise<AccountResponse> => {
    const account = await repositories.accounts.findById(userId, accountId);

    if (!account) {
      throw new DomainError(404, {
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Account not found.',
      });
    }

    return account;
  },

  listByUser: async (userId: number, query: AccountsListQuery) => {
    const filters = {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
      ...(query.account_type_id !== undefined ? { accountTypeId: query.account_type_id } : {}),
    };

    const data = await repositories.accounts.listByUser(userId, {
      ...filters,
    });

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    accountId: number,
    payload: UpdateAccountPayload,
  ): Promise<AccountResponse> => {
    const account = await repositories.accounts.updateById(
      userId,
      accountId,
      omitUndefined(payload) as AccountUpdate,
    );

    if (!account) {
      throw new DomainError(404, {
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Account not found.',
      });
    }

    return account;
  },

  deleteById: async (userId: number, accountId: number): Promise<void> => {
    const deleted = await repositories.accounts.deleteById(userId, accountId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Account not found.',
      });
    }
  },

  getCurrentBalance: async (userId: number, accountId: number): Promise<number> => {
    const balance = await repositories.accounts.getCurrentBalance(userId, accountId);

    if (balance === undefined) {
      throw new DomainError(404, {
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Account not found.',
      });
    }

    return balance;
  },
});

export type AccountsService = ReturnType<typeof createAccountsService>;
