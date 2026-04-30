import type { CreditCard,CreditCardUpdate, NewCreditCard } from '@db/schema';

class CreditCardsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.creditCards.list(input);
  }

  listAll(): Promise<CreditCard[]> {
    return window.fortuna.creditCards.listAll() as Promise<CreditCard[]>;
  }

  findOne(id: number): Promise<CreditCard | undefined> {
    return window.fortuna.creditCards.findOne(id) as Promise<CreditCard | undefined>;
  }

  add(input: NewCreditCard): Promise<CreditCard> {
    return window.fortuna.creditCards.add(input) as Promise<CreditCard>;
  }

  change(input: { id: number; changes: Partial<CreditCardUpdate> }): Promise<CreditCard | undefined> {
    return window.fortuna.creditCards.change(input) as Promise<CreditCard | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.creditCards.remove(id) as Promise<boolean>;
  }
}

export const creditCardsService = new CreditCardsService();
