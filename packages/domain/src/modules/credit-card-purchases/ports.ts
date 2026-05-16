import type {
  CreditCardPurchaseResponse,
  CreditCardPurchaseUpdate,
  NewCreditCardPurchase,
} from '@repo/shared';

export interface CreditCardPurchasesListFilters {
  categoryId?: number;
  payeeId?: number;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreditCardPurchasesPort {
  create(payload: NewCreditCardPurchase): Promise<CreditCardPurchaseResponse>;
  findById(userId: number, purchaseId: number): Promise<CreditCardPurchaseResponse | undefined>;
  listByCard(
    userId: number,
    creditCardId: number,
    filters?: CreditCardPurchasesListFilters,
  ): Promise<CreditCardPurchaseResponse[]>;
  updateById(
    userId: number,
    purchaseId: number,
    payload: CreditCardPurchaseUpdate,
  ): Promise<CreditCardPurchaseResponse | undefined>;
  deleteById(userId: number, purchaseId: number): Promise<boolean>;
}
