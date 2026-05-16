import type { CreditCardPurchaseResponse, CreditCardPurchaseUpdate, NewCreditCardPurchase } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CreditCardPurchasesListFilters, CreditCardPurchasesPort } from '../ports.js';

export const createCreditCardPurchasesUseCases = (creditCardPurchases: CreditCardPurchasesPort) => ({
  create: (payload: NewCreditCardPurchase): Promise<CreditCardPurchaseResponse> =>
    creditCardPurchases.create(payload),
  findById: async (userId: number, purchaseId: number): Promise<CreditCardPurchaseResponse> => {
    const purchase = await creditCardPurchases.findById(userId, purchaseId);
    if (!purchase) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_NOT_FOUND',
        message: 'Credit card purchase not found.',
      });
    }
    return purchase;
  },
  listByCard: (
    userId: number,
    creditCardId: number,
    filters: CreditCardPurchasesListFilters,
  ): Promise<CreditCardPurchaseResponse[]> => creditCardPurchases.listByCard(userId, creditCardId, filters),
  updateById: async (
    userId: number,
    purchaseId: number,
    payload: CreditCardPurchaseUpdate,
  ): Promise<CreditCardPurchaseResponse> => {
    const purchase = await creditCardPurchases.updateById(userId, purchaseId, payload);
    if (!purchase) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_NOT_FOUND',
        message: 'Credit card purchase not found.',
      });
    }
    return purchase;
  },
  deleteById: async (userId: number, purchaseId: number): Promise<void> => {
    const deleted = await creditCardPurchases.deleteById(userId, purchaseId);
    if (!deleted) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_NOT_FOUND',
        message: 'Credit card purchase not found.',
      });
    }
  },
});
