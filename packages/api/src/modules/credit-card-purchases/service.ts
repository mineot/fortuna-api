import type {
  CreateCreditCardPurchaseDto,
  CreditCardPurchaseResponse,
  CreditCardPurchaseUpdate,
  UpdateCreditCardPurchaseDto,
} from '@repo/shared';
import { createCreatePurchaseWithInstallmentsUseCase } from '@repo/domain';

import { DomainError } from '../../lib/errors.js';
import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CreditCardPurchasesListQuery extends PaginationInput {
  category_id?: number | undefined;
  payee_id?: number | undefined;
  purchase_date_from?: string | undefined;
  purchase_date_to?: string | undefined;
}

type CreateCreditCardPurchasePayload = Omit<CreateCreditCardPurchaseDto, 'credit_card_id'>;
type UpdateCreditCardPurchasePayload = UpdateCreditCardPurchaseDto;

export interface CreatePurchaseWithInstallmentsPayload extends CreateCreditCardPurchasePayload {
  installments: Array<{
    credit_card_statement_id: number;
    installment_number: number;
    amount: number;
    competence_date: string;
  }>;
}

export const createCreditCardPurchasesService = (repositories: ApiRepositories) => {
  const createPurchaseWithInstallmentsUseCase = createCreatePurchaseWithInstallmentsUseCase({
    creditCards: {
      createPurchaseWithInstallments: repositories.creditCardPurchases.createWithInstallments,
      registerStatementPayment: repositories.creditCardStatements.registerPayment,
    },
  });

  return {
    create: async (
      creditCardId: number,
      payload: CreateCreditCardPurchasePayload,
    ): Promise<CreditCardPurchaseResponse> => {
      return repositories.creditCardPurchases.create({
        credit_card_id: creditCardId,
        ...payload,
        payee_id: payload.payee_id ?? null,
      });
    },

    createWithInstallments: async (
      userId: number,
      creditCardId: number,
      payload: CreatePurchaseWithInstallmentsPayload,
    ) => {
      try {
        return await createPurchaseWithInstallmentsUseCase({
          userId,
          creditCardId,
          payload: {
            category_id: payload.category_id,
            payee_id: payload.payee_id ?? null,
            description: payload.description,
            total_amount: payload.total_amount,
            installment_count: payload.installment_count,
            purchase_date: payload.purchase_date,
            installments: payload.installments.map((item) => ({
              credit_card_statement_id: item.credit_card_statement_id,
              installment_number: item.installment_number,
              amount: item.amount,
              competence_date: item.competence_date,
            })),
          },
        });
      } catch (error) {
        return mapDomainError(error);
      }
    },

    findById: async (userId: number, purchaseId: number): Promise<CreditCardPurchaseResponse> => {
      const purchase = await repositories.creditCardPurchases.findById(userId, purchaseId);

      if (!purchase) {
        throw new DomainError(404, {
          code: 'CREDIT_CARD_PURCHASE_NOT_FOUND',
          message: 'Credit card purchase not found.',
        });
      }

      return purchase;
    },

    listByCard: async (userId: number, creditCardId: number, query: CreditCardPurchasesListQuery) => {
      const data = await repositories.creditCardPurchases.listByCard(userId, creditCardId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.category_id !== undefined ? { categoryId: query.category_id } : {}),
        ...(query.payee_id !== undefined ? { payeeId: query.payee_id } : {}),
        ...(query.purchase_date_from !== undefined ? { purchaseDateFrom: query.purchase_date_from } : {}),
        ...(query.purchase_date_to !== undefined ? { purchaseDateTo: query.purchase_date_to } : {}),
      });

      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      purchaseId: number,
      payload: UpdateCreditCardPurchasePayload,
    ): Promise<CreditCardPurchaseResponse> => {
      const purchase = await repositories.creditCardPurchases.updateById(
        userId,
        purchaseId,
        omitUndefined(payload) as CreditCardPurchaseUpdate,
      );

      if (!purchase) {
        throw new DomainError(404, {
          code: 'CREDIT_CARD_PURCHASE_NOT_FOUND',
          message: 'Credit card purchase not found.',
        });
      }

      return purchase;
    },

    deleteById: async (userId: number, purchaseId: number): Promise<void> => {
      const deleted = await repositories.creditCardPurchases.deleteById(userId, purchaseId);

      if (!deleted) {
        throw new DomainError(404, {
          code: 'CREDIT_CARD_PURCHASE_NOT_FOUND',
          message: 'Credit card purchase not found.',
        });
      }
    },
  };
};
