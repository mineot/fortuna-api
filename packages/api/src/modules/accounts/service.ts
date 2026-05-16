import type { AccountResponse, AccountUpdate, CreateAccountDto, UpdateAccountDto } from '@repo/shared';
import { createAccountsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface AccountsListQuery extends PaginationInput {
  account_type_id?: number | undefined;
}

type CreateAccountPayload = Omit<CreateAccountDto, 'user_id'>;
type UpdateAccountPayload = Omit<UpdateAccountDto, 'user_id'>;

export const createAccountsService = (repositories: ApiRepositories) => {
  const useCases = createAccountsUseCases(repositories.accounts);

  return {
    create: async (userId: number, payload: CreateAccountPayload): Promise<AccountResponse> =>
      useCases.create({ user_id: userId, ...payload, notes: payload.notes ?? null }),

    findById: async (userId: number, accountId: number): Promise<AccountResponse> => {
      try {
        return await useCases.findById(userId, accountId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByUser: async (userId: number, query: AccountsListQuery) => {
      const data = await useCases.listByUser(userId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.account_type_id !== undefined ? { accountTypeId: query.account_type_id } : {}),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (userId: number, accountId: number, payload: UpdateAccountPayload): Promise<AccountResponse> => {
      try {
        return await useCases.updateById(userId, accountId, omitUndefined(payload) as AccountUpdate);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, accountId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, accountId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    getCurrentBalance: async (userId: number, accountId: number): Promise<number> => {
      try {
        return await useCases.getCurrentBalance(userId, accountId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};

export type AccountsService = ReturnType<typeof createAccountsService>;
