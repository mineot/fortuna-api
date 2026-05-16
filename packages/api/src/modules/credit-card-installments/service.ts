import type {
  CreateCreditCardInstallmentDto,
  CreditCardInstallmentResponse,
  CreditCardInstallmentUpdate,
  UpdateCreditCardInstallmentDto,
} from '@repo/shared';
import { createCreditCardInstallmentsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CreditCardInstallmentsListQuery extends PaginationInput {
  statement_id?: number | undefined;
  competence_date_from?: string | undefined;
  competence_date_to?: string | undefined;
}

type CreateCreditCardInstallmentPayload = CreateCreditCardInstallmentDto;
type UpdateCreditCardInstallmentPayload = UpdateCreditCardInstallmentDto;

export const createCreditCardInstallmentsService = (repositories: ApiRepositories) => {
  const useCases = createCreditCardInstallmentsUseCases(repositories.creditCardInstallments);

  return {
    create: async (payload: CreateCreditCardInstallmentPayload): Promise<CreditCardInstallmentResponse> =>
      useCases.create(payload),

    findById: async (userId: number, installmentId: number): Promise<CreditCardInstallmentResponse> => {
      try {
        return await useCases.findById(userId, installmentId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByPurchase: async (userId: number, purchaseId: number, query: CreditCardInstallmentsListQuery) => {
      const data = await useCases.listByPurchase(userId, purchaseId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.statement_id !== undefined ? { statementId: query.statement_id } : {}),
        ...(query.competence_date_from !== undefined ? { competenceDateFrom: query.competence_date_from } : {}),
        ...(query.competence_date_to !== undefined ? { competenceDateTo: query.competence_date_to } : {}),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      installmentId: number,
      payload: UpdateCreditCardInstallmentPayload,
    ): Promise<CreditCardInstallmentResponse> => {
      try {
        return await useCases.updateById(
          userId,
          installmentId,
          omitUndefined(payload) as CreditCardInstallmentUpdate,
        );
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, installmentId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, installmentId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};
