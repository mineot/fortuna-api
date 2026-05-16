import type {
  CreateCreditCardInstallmentDto,
  CreditCardInstallmentResponse,
  CreditCardInstallmentUpdate,
  UpdateCreditCardInstallmentDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
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

export const createCreditCardInstallmentsService = (repositories: ApiRepositories) => ({
  create: async (
    payload: CreateCreditCardInstallmentPayload,
  ): Promise<CreditCardInstallmentResponse> => {
    return repositories.creditCardInstallments.create(payload);
  },

  findById: async (userId: number, installmentId: number): Promise<CreditCardInstallmentResponse> => {
    const installment = await repositories.creditCardInstallments.findById(userId, installmentId);

    if (!installment) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_INSTALLMENT_NOT_FOUND',
        message: 'Credit card installment not found.',
      });
    }

    return installment;
  },

  listByPurchase: async (
    userId: number,
    purchaseId: number,
    query: CreditCardInstallmentsListQuery,
  ) => {
    const data = await repositories.creditCardInstallments.listByPurchase(userId, purchaseId, {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
      ...(query.statement_id !== undefined ? { statementId: query.statement_id } : {}),
      ...(query.competence_date_from !== undefined
        ? { competenceDateFrom: query.competence_date_from }
        : {}),
      ...(query.competence_date_to !== undefined ? { competenceDateTo: query.competence_date_to } : {}),
    });

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    installmentId: number,
    payload: UpdateCreditCardInstallmentPayload,
  ): Promise<CreditCardInstallmentResponse> => {
    const installment = await repositories.creditCardInstallments.updateById(
      userId,
      installmentId,
      omitUndefined(payload) as CreditCardInstallmentUpdate,
    );

    if (!installment) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_INSTALLMENT_NOT_FOUND',
        message: 'Credit card installment not found.',
      });
    }

    return installment;
  },

  deleteById: async (userId: number, installmentId: number): Promise<void> => {
    const deleted = await repositories.creditCardInstallments.deleteById(userId, installmentId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_INSTALLMENT_NOT_FOUND',
        message: 'Credit card installment not found.',
      });
    }
  },
});
