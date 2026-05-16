import type {
  CreateRecurringTransactionDto,
  RecurrenceFrequency,
  RecurrenceType,
  RecurringTransactionResponse,
  RecurringTransactionUpdate,
  TransactionType,
  UpdateRecurringTransactionDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
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

export const createRecurringTransactionsService = (repositories: ApiRepositories) => ({
  create: async (
    userId: number,
    payload: CreateRecurringTransactionPayload,
  ): Promise<RecurringTransactionResponse> => {
    return repositories.recurringTransactions.create({
      user_id: userId,
      ...payload,
      payee_id: payload.payee_id ?? null,
      description: payload.description ?? null,
      end_date: payload.end_date ?? null,
    });
  },

  findById: async (
    userId: number,
    recurringTransactionId: number,
  ): Promise<RecurringTransactionResponse> => {
    const recurringTransaction = await repositories.recurringTransactions.findById(
      userId,
      recurringTransactionId,
    );

    if (!recurringTransaction) {
      throw new DomainError(404, {
        code: 'RECURRING_TRANSACTION_NOT_FOUND',
        message: 'Recurring transaction not found.',
      });
    }

    return recurringTransaction;
  },

  listByUser: async (userId: number, query: RecurringTransactionsListQuery) => {
    const filters = {
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
    };

    const data = await repositories.recurringTransactions.listByUser(userId, filters);

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    recurringTransactionId: number,
    payload: UpdateRecurringTransactionPayload,
  ): Promise<RecurringTransactionResponse> => {
    const recurringTransaction = await repositories.recurringTransactions.updateById(
      userId,
      recurringTransactionId,
      omitUndefined(payload) as RecurringTransactionUpdate,
    );

    if (!recurringTransaction) {
      throw new DomainError(404, {
        code: 'RECURRING_TRANSACTION_NOT_FOUND',
        message: 'Recurring transaction not found.',
      });
    }

    return recurringTransaction;
  },

  deleteById: async (userId: number, recurringTransactionId: number): Promise<void> => {
    const deleted = await repositories.recurringTransactions.deleteById(userId, recurringTransactionId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'RECURRING_TRANSACTION_NOT_FOUND',
        message: 'Recurring transaction not found.',
      });
    }
  },
});

export type RecurringTransactionsService = ReturnType<typeof createRecurringTransactionsService>;
