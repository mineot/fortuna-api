import type {
  CreateRecurringTransactionDto,
  RecurrenceFrequency,
  RecurrenceType,
  RecurringTransactionResponse,
  RecurringTransactionUpdate,
  TransactionType,
  UpdateRecurringTransactionDto,
} from '@repo/shared';
import { createRecurringTransactionsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface RecurringTransactionsListQuery extends PaginationInput {
  active?: 0 | 1 | undefined;
  account_id?: number | undefined;
  category_id?: number | undefined;
  payee_id?: number | undefined;
  type?: TransactionType | undefined;
  recurrence_type?: RecurrenceType | undefined;
  frequency?: RecurrenceFrequency | undefined;
  due_day?: number | undefined;
}

type CreateRecurringTransactionPayload = Omit<CreateRecurringTransactionDto, 'user_id'>;
type UpdateRecurringTransactionPayload = Omit<UpdateRecurringTransactionDto, 'user_id'>;

export const createRecurringTransactionsService = (repositories: ApiRepositories) => {
  const useCases = createRecurringTransactionsUseCases(repositories.recurringTransactions);

  return {
    create: async (userId: number, payload: CreateRecurringTransactionPayload): Promise<RecurringTransactionResponse> =>
      useCases.create({
        user_id: userId,
        ...payload,
        payee_id: payload.payee_id ?? null,
        description: payload.description ?? null,
        end_date: payload.end_date ?? null,
      }),

    findById: async (userId: number, recurringTransactionId: number): Promise<RecurringTransactionResponse> => {
      try {
        return await useCases.findById(userId, recurringTransactionId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByUser: async (userId: number, query: RecurringTransactionsListQuery) => {
      const data = await useCases.listByUser(userId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.active !== undefined ? { active: query.active } : {}),
        ...(query.account_id !== undefined ? { accountId: query.account_id } : {}),
        ...(query.category_id !== undefined ? { categoryId: query.category_id } : {}),
        ...(query.payee_id !== undefined ? { payeeId: query.payee_id } : {}),
        ...(query.type !== undefined ? { type: query.type } : {}),
        ...(query.recurrence_type !== undefined ? { recurrenceType: query.recurrence_type } : {}),
        ...(query.frequency !== undefined ? { frequency: query.frequency } : {}),
        ...(query.due_day !== undefined ? { dueDay: query.due_day } : {}),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      recurringTransactionId: number,
      payload: UpdateRecurringTransactionPayload,
    ): Promise<RecurringTransactionResponse> => {
      try {
        return await useCases.updateById(
          userId,
          recurringTransactionId,
          omitUndefined(payload) as RecurringTransactionUpdate,
        );
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, recurringTransactionId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, recurringTransactionId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};

export type RecurringTransactionsService = ReturnType<typeof createRecurringTransactionsService>;
