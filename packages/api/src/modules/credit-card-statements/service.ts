import type {
  CreateCreditCardStatementDto,
  CreditCardStatementResponse,
  CreditCardStatementStatus,
  CreditCardStatementUpdate,
  TransactionStatus,
  UpdateCreditCardStatementDto,
} from '@repo/shared';
import {
  createCreditCardStatementsUseCases,
  createRegisterStatementPaymentUseCase,
} from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CreditCardStatementsListQuery extends PaginationInput {
  status?: CreditCardStatementStatus | undefined;
  due_date_from?: string | undefined;
  due_date_to?: string | undefined;
}

type CreateCreditCardStatementPayload = Omit<CreateCreditCardStatementDto, 'credit_card_id'>;
type UpdateCreditCardStatementPayload = UpdateCreditCardStatementDto;

export interface RegisterStatementPaymentPayload {
  account_id: number;
  amount: number;
  date: string;
  category_id: number;
  description: string;
  payee_id?: number | null | undefined;
  notes?: string | null | undefined;
  transaction_status?: TransactionStatus | undefined;
}

export const createCreditCardStatementsService = (repositories: ApiRepositories) => {
  const statementsUseCases = createCreditCardStatementsUseCases(repositories.creditCardStatements);
  const registerStatementPaymentUseCase = createRegisterStatementPaymentUseCase({
    creditCards: {
      createPurchaseWithInstallments: repositories.creditCardPurchases.createWithInstallments,
      registerStatementPayment: repositories.creditCardStatements.registerPayment,
    },
  });

  return {
    create: async (
      userId: number,
      creditCardId: number,
      payload: CreateCreditCardStatementPayload,
    ): Promise<CreditCardStatementResponse> =>
      statementsUseCases.create({ credit_card_id: creditCardId, ...payload }),

    findById: async (userId: number, statementId: number): Promise<CreditCardStatementResponse> => {
      try {
        return await statementsUseCases.findById(userId, statementId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByCard: async (userId: number, creditCardId: number, query: CreditCardStatementsListQuery) => {
      const data = await statementsUseCases.listByCard(userId, creditCardId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.status !== undefined ? { status: query.status } : {}),
        ...(query.due_date_from !== undefined ? { dueDateFrom: query.due_date_from } : {}),
        ...(query.due_date_to !== undefined ? { dueDateTo: query.due_date_to } : {}),
      });

      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      statementId: number,
      payload: UpdateCreditCardStatementPayload,
    ): Promise<CreditCardStatementResponse> => {
      try {
        return await statementsUseCases.updateById(
          userId,
          statementId,
          omitUndefined(payload) as CreditCardStatementUpdate,
        );
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, statementId: number): Promise<void> => {
      try {
        await statementsUseCases.deleteById(userId, statementId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    getTotals: async (userId: number, statementId: number) => {
      try {
        return await statementsUseCases.getTotals(userId, statementId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    registerPayment: async (
      userId: number,
      statementId: number,
      payload: RegisterStatementPaymentPayload,
    ) => {
      try {
        return await registerStatementPaymentUseCase({
          userId,
          statementId,
          accountId: payload.account_id,
          amount: payload.amount,
          date: payload.date,
          categoryId: payload.category_id,
          description: payload.description,
          payeeId: payload.payee_id ?? null,
          notes: payload.notes ?? null,
          ...(payload.transaction_status !== undefined
            ? { transactionStatus: payload.transaction_status }
            : {}),
        });
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};
