import type {
  CreditCardStatementPaymentResponse,
  CreditCardStatementPaymentUpdate,
  NewCreditCardStatementPayment,
  UpdateCreditCardStatementPaymentDto,
} from '@repo/shared';
import { createCreditCardStatementPaymentsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CreditCardStatementPaymentsListQuery extends PaginationInput {
  account_id?: number | undefined;
  date_from?: string | undefined;
  date_to?: string | undefined;
}

type UpdateCreditCardStatementPaymentPayload = UpdateCreditCardStatementPaymentDto;

export const createCreditCardStatementPaymentsService = (repositories: ApiRepositories) => {
  const useCases = createCreditCardStatementPaymentsUseCases(repositories.creditCardStatementPayments);

  return {
    create: async (payload: NewCreditCardStatementPayment): Promise<CreditCardStatementPaymentResponse> =>
      useCases.create(payload),

    findById: async (userId: number, paymentId: number): Promise<CreditCardStatementPaymentResponse> => {
      try {
        return await useCases.findById(userId, paymentId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByStatement: async (
      userId: number,
      statementId: number,
      query: CreditCardStatementPaymentsListQuery,
    ) => {
      const data = await useCases.listByStatement(userId, statementId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.account_id !== undefined ? { accountId: query.account_id } : {}),
        ...(query.date_from !== undefined ? { dateFrom: query.date_from } : {}),
        ...(query.date_to !== undefined ? { dateTo: query.date_to } : {}),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      paymentId: number,
      payload: UpdateCreditCardStatementPaymentPayload,
    ): Promise<CreditCardStatementPaymentResponse> => {
      try {
        return await useCases.updateById(
          userId,
          paymentId,
          omitUndefined(payload) as CreditCardStatementPaymentUpdate,
        );
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, paymentId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, paymentId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};
