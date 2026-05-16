import type {
  CreateTransactionDto,
  TransactionResponse,
  TransactionStatus,
  TransactionType,
  TransactionUpdate,
  UpdateTransactionDto,
} from '@repo/shared';
import { createCreateTransactionUseCase } from '@repo/domain';

import { DomainError } from '../../lib/errors.js';
import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface TransactionsListQuery extends PaginationInput {
  account_id?: number | undefined;
  category_id?: number | undefined;
  payee_id?: number | undefined;
  type?: TransactionType | undefined;
  status?: TransactionStatus | undefined;
  date_from?: string | undefined;
  date_to?: string | undefined;
}

type CreateTransactionPayload = Omit<CreateTransactionDto, 'user_id'>;
type UpdateTransactionPayload = Omit<UpdateTransactionDto, 'user_id'>;

export const createTransactionsService = (repositories: ApiRepositories) => {
  const createTransactionUseCase = createCreateTransactionUseCase({
    transactions: repositories.transactions,
  });

  return {
    create: async (
      userId: number,
      payload: CreateTransactionPayload,
    ): Promise<TransactionResponse> => {
      try {
        return await createTransactionUseCase({
          user_id: userId,
          ...payload,
          payee_id: payload.payee_id ?? null,
          notes: payload.notes ?? null,
        });
      } catch (error) {
        return mapDomainError(error);
      }
    },

    findById: async (userId: number, transactionId: number): Promise<TransactionResponse> => {
      const transaction = await repositories.transactions.findById(userId, transactionId);

      if (!transaction) {
        throw new DomainError(404, {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found.',
        });
      }

      return transaction;
    },

    listByUser: async (userId: number, query: TransactionsListQuery) => {
      const filters = {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.account_id !== undefined ? { accountId: query.account_id } : {}),
        ...(query.category_id !== undefined ? { categoryId: query.category_id } : {}),
        ...(query.payee_id !== undefined ? { payeeId: query.payee_id } : {}),
        ...(query.type !== undefined ? { type: query.type } : {}),
        ...(query.status !== undefined ? { status: query.status } : {}),
        ...(query.date_from !== undefined ? { dateFrom: query.date_from } : {}),
        ...(query.date_to !== undefined ? { dateTo: query.date_to } : {}),
      };

      const data = await repositories.transactions.listByUser(userId, filters);

      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      transactionId: number,
      payload: UpdateTransactionPayload,
    ): Promise<TransactionResponse> => {
      const transaction = await repositories.transactions.updateById(
        userId,
        transactionId,
        omitUndefined(payload) as TransactionUpdate,
      );

      if (!transaction) {
        throw new DomainError(404, {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found.',
        });
      }

      return transaction;
    },

    deleteById: async (userId: number, transactionId: number): Promise<void> => {
      const deleted = await repositories.transactions.deleteById(userId, transactionId);

      if (!deleted) {
        throw new DomainError(404, {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found.',
        });
      }
    },
  };
};

export type TransactionsService = ReturnType<typeof createTransactionsService>;
