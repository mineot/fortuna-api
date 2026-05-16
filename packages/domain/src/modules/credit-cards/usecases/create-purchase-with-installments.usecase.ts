import { DomainError } from '../../../errors/domain-error.js';
import type {
  CreditCardInstallmentInput,
  CreditCardPurchaseInput,
  CreditCardsPort,
  PurchaseWithInstallmentsResult,
} from '../ports.js';

export interface CreatePurchaseWithInstallmentsUseCaseInput {
  userId: number;
  creditCardId: number;
  payload: Omit<CreditCardPurchaseInput, 'credit_card_id'> & {
    installments: CreditCardInstallmentInput[];
  };
}

export interface CreatePurchaseWithInstallmentsUseCaseDeps {
  creditCards: CreditCardsPort;
}

export const createCreatePurchaseWithInstallmentsUseCase = (
  deps: CreatePurchaseWithInstallmentsUseCaseDeps,
) => {
  return async (
    input: CreatePurchaseWithInstallmentsUseCaseInput,
  ): Promise<PurchaseWithInstallmentsResult> => {
    const purchase: CreditCardPurchaseInput = {
      credit_card_id: input.creditCardId,
      category_id: input.payload.category_id,
      payee_id: input.payload.payee_id,
      description: input.payload.description,
      total_amount: input.payload.total_amount,
      installment_count: input.payload.installment_count,
      purchase_date: input.payload.purchase_date,
    };

    const installments = input.payload.installments;

    if (purchase.total_amount <= 0) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_INVALID_TOTAL_AMOUNT',
        message: 'Purchase total amount must be greater than zero.',
      });
    }

    if (purchase.installment_count < 1) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_INVALID_INSTALLMENT_COUNT',
        message: 'Installment count must be at least 1.',
      });
    }

    if (installments.length !== purchase.installment_count) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_INSTALLMENT_COUNT_MISMATCH',
        message: 'Installments length must match installment_count.',
      });
    }

    const totalInstallments = installments.reduce((acc, item) => acc + item.amount, 0);

    if (totalInstallments !== purchase.total_amount) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_INSTALLMENT_SUM_MISMATCH',
        message: 'Installments total amount must match purchase total amount.',
      });
    }

    try {
      return await deps.creditCards.createPurchaseWithInstallments(
        input.userId,
        purchase,
        installments,
      );
    } catch (error) {
      throw new DomainError({
        code: 'CREDIT_CARD_PURCHASE_CREATE_ERROR',
        message: error instanceof Error ? error.message : 'Could not create credit card purchase.',
      });
    }
  };
};
