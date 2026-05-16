import type { CreditCardResponse, CreditCardUpdate, NewCreditCard } from '@repo/shared';

export interface CreditCardsListFilters {
  limit?: number;
  offset?: number;
}

export interface CreditCardsBasicPort {
  create(payload: NewCreditCard): Promise<CreditCardResponse>;
  findById(userId: number, creditCardId: number): Promise<CreditCardResponse | undefined>;
  listByUser(userId: number, filters?: CreditCardsListFilters): Promise<CreditCardResponse[]>;
  updateById(userId: number, creditCardId: number, payload: CreditCardUpdate): Promise<CreditCardResponse | undefined>;
  deleteById(userId: number, creditCardId: number): Promise<boolean>;
}
