import type { CreatePayeeDto, PayeeResponse, PayeeUpdate, UpdatePayeeDto } from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface PayeesListQuery extends PaginationInput {
  search?: string | undefined;
}

type CreatePayeePayload = Omit<CreatePayeeDto, 'user_id'>;
type UpdatePayeePayload = Omit<UpdatePayeeDto, 'user_id'>;

export const createPayeesService = (repositories: ApiRepositories) => ({
  create: async (userId: number, payload: CreatePayeePayload): Promise<PayeeResponse> => {
    return repositories.payees.create({
      user_id: userId,
      ...payload,
    });
  },

  findById: async (userId: number, payeeId: number): Promise<PayeeResponse> => {
    const payee = await repositories.payees.findById(userId, payeeId);

    if (!payee) {
      throw new DomainError(404, {
        code: 'PAYEE_NOT_FOUND',
        message: 'Payee not found.',
      });
    }

    return payee;
  },

  listByUser: async (userId: number, query: PayeesListQuery) => {
    const filters = {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
      ...(query.search !== undefined ? { search: query.search } : {}),
    };

    const data = await repositories.payees.listByUser(userId, {
      ...filters,
    });

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    payeeId: number,
    payload: UpdatePayeePayload,
  ): Promise<PayeeResponse> => {
    const payee = await repositories.payees.updateById(
      userId,
      payeeId,
      omitUndefined(payload) as PayeeUpdate,
    );

    if (!payee) {
      throw new DomainError(404, {
        code: 'PAYEE_NOT_FOUND',
        message: 'Payee not found.',
      });
    }

    return payee;
  },

  deleteById: async (userId: number, payeeId: number): Promise<void> => {
    const deleted = await repositories.payees.deleteById(userId, payeeId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'PAYEE_NOT_FOUND',
        message: 'Payee not found.',
      });
    }
  },
});

export type PayeesService = ReturnType<typeof createPayeesService>;
