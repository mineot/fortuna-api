import type { CreatePayeeDto, PayeeResponse, PayeeUpdate, UpdatePayeeDto } from '@repo/shared';
import { createPayeesUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface PayeesListQuery extends PaginationInput {
  search?: string | undefined;
}

type CreatePayeePayload = Omit<CreatePayeeDto, 'user_id'>;
type UpdatePayeePayload = Omit<UpdatePayeeDto, 'user_id'>;

export const createPayeesService = (repositories: ApiRepositories) => {
  const useCases = createPayeesUseCases(repositories.payees);

  return {
    create: async (userId: number, payload: CreatePayeePayload): Promise<PayeeResponse> =>
      useCases.create({ user_id: userId, ...payload }),

    findById: async (userId: number, payeeId: number): Promise<PayeeResponse> => {
      try {
        return await useCases.findById(userId, payeeId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByUser: async (userId: number, query: PayeesListQuery) => {
      const data = await useCases.listByUser(userId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.search !== undefined ? { search: query.search } : {}),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (userId: number, payeeId: number, payload: UpdatePayeePayload): Promise<PayeeResponse> => {
      try {
        return await useCases.updateById(userId, payeeId, omitUndefined(payload) as PayeeUpdate);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, payeeId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, payeeId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};

export type PayeesService = ReturnType<typeof createPayeesService>;
