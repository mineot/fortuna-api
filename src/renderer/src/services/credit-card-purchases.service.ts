import type { CreditCardPurchase,CreditCardPurchaseUpdate, NewCreditCardPurchase } from '@db/schema';

class CreditCardPurchasesService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.creditCardPurchases.list(input);
  }

  listAll(): Promise<CreditCardPurchase[]> {
    return window.fortuna.creditCardPurchases.listAll() as Promise<CreditCardPurchase[]>;
  }

  findOne(id: number): Promise<CreditCardPurchase | undefined> {
    return window.fortuna.creditCardPurchases.findOne(id) as Promise<CreditCardPurchase | undefined>;
  }

  add(input: NewCreditCardPurchase): Promise<CreditCardPurchase> {
    return window.fortuna.creditCardPurchases.add(input) as Promise<CreditCardPurchase>;
  }

  change(input: { id: number; changes: Partial<CreditCardPurchaseUpdate> }): Promise<CreditCardPurchase | undefined> {
    return window.fortuna.creditCardPurchases.change(input) as Promise<CreditCardPurchase | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.creditCardPurchases.remove(id) as Promise<boolean>;
  }
}

export const creditCardPurchasesService = new CreditCardPurchasesService();
