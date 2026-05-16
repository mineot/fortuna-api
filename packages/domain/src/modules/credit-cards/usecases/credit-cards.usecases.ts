import type { CreditCardResponse, CreditCardUpdate, NewCreditCard } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CreditCardsBasicPort, CreditCardsListFilters } from '../basic-ports.js';

export const createCreditCardsUseCases = (creditCards: CreditCardsBasicPort) => ({
  create: (payload: NewCreditCard): Promise<CreditCardResponse> => creditCards.create(payload),
  findById: async (userId: number, creditCardId: number): Promise<CreditCardResponse> => {
    const card = await creditCards.findById(userId, creditCardId);
    if (!card) throw new DomainError({ code: 'CREDIT_CARD_NOT_FOUND', message: 'Credit card not found.' });
    return card;
  },
  listByUser: (userId: number, filters: CreditCardsListFilters): Promise<CreditCardResponse[]> => creditCards.listByUser(userId, filters),
  updateById: async (userId: number, creditCardId: number, payload: CreditCardUpdate): Promise<CreditCardResponse> => {
    const card = await creditCards.updateById(userId, creditCardId, payload);
    if (!card) throw new DomainError({ code: 'CREDIT_CARD_NOT_FOUND', message: 'Credit card not found.' });
    return card;
  },
  deleteById: async (userId: number, creditCardId: number): Promise<void> => {
    const deleted = await creditCards.deleteById(userId, creditCardId);
    if (!deleted) throw new DomainError({ code: 'CREDIT_CARD_NOT_FOUND', message: 'Credit card not found.' });
  },
});
