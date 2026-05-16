import type {
  CreditCardStatementPaymentResponse,
  CreditCardStatementPaymentUpdate,
  NewCreditCardStatementPayment,
  UpdateCreditCardStatementPaymentDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CreditCardStatementPaymentsListQuery extends PaginationInput {
  account_id?: number | undefined;
  date_from?: string | undefined;
  date_to?: string | undefined;
}

type UpdateCreditCardStatementPaymentPayload = UpdateCreditCardStatementPaymentDto;

export const createCreditCardStatementPaymentsService = (repositories: ApiRepositories) => ({
  create: async (payload: NewCreditCardStatementPayment): Promise<CreditCardStatementPaymentResponse> => {
    return repositories.creditCardStatementPayments.create(payload);
  },

  findById: async (userId: number, paymentId: number): Promise<CreditCardStatementPaymentResponse> => {
    const payment = await repositories.creditCardStatementPayments.findById(userId, paymentId);

    if (!payment) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_PAYMENT_NOT_FOUND',
        message: 'Credit card statement payment not found.',
      });
    }

    return payment;
  },

  listByStatement: async (
    userId: number,
    statementId: number,
    query: CreditCardStatementPaymentsListQuery,
  ) => {
    const data = await repositories.creditCardStatementPayments.listByStatement(userId, statementId, {
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
    const payment = await repositories.creditCardStatementPayments.updateById(
      userId,
      paymentId,
      omitUndefined(payload) as CreditCardStatementPaymentUpdate,
    );

    if (!payment) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_PAYMENT_NOT_FOUND',
        message: 'Credit card statement payment not found.',
      });
    }

    return payment;
  },

  deleteById: async (userId: number, paymentId: number): Promise<void> => {
    const deleted = await repositories.creditCardStatementPayments.deleteById(userId, paymentId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_PAYMENT_NOT_FOUND',
        message: 'Credit card statement payment not found.',
      });
    }
  },
});
