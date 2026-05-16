import type {
  CreditCardInstallmentResponse,
  CreditCardInstallmentUpdate,
  NewCreditCardInstallment,
} from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CreditCardInstallmentsListFilters, CreditCardInstallmentsPort } from '../ports.js';

export const createCreditCardInstallmentsUseCases = (
  creditCardInstallments: CreditCardInstallmentsPort,
) => ({
  create: (payload: NewCreditCardInstallment): Promise<CreditCardInstallmentResponse> =>
    creditCardInstallments.create(payload),
  findById: async (userId: number, installmentId: number): Promise<CreditCardInstallmentResponse> => {
    const item = await creditCardInstallments.findById(userId, installmentId);
    if (!item) throw new DomainError({ code: 'CREDIT_CARD_INSTALLMENT_NOT_FOUND', message: 'Credit card installment not found.' });
    return item;
  },
  listByPurchase: (
    userId: number,
    purchaseId: number,
    filters: CreditCardInstallmentsListFilters,
  ): Promise<CreditCardInstallmentResponse[]> =>
    creditCardInstallments.listByPurchase(userId, purchaseId, filters),
  updateById: async (
    userId: number,
    installmentId: number,
    payload: CreditCardInstallmentUpdate,
  ): Promise<CreditCardInstallmentResponse> => {
    const item = await creditCardInstallments.updateById(userId, installmentId, payload);
    if (!item) throw new DomainError({ code: 'CREDIT_CARD_INSTALLMENT_NOT_FOUND', message: 'Credit card installment not found.' });
    return item;
  },
  deleteById: async (userId: number, installmentId: number): Promise<void> => {
    const deleted = await creditCardInstallments.deleteById(userId, installmentId);
    if (!deleted) throw new DomainError({ code: 'CREDIT_CARD_INSTALLMENT_NOT_FOUND', message: 'Credit card installment not found.' });
  },
});
