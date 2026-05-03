import type { CreditCardPurchase, CreditCardPurchaseUpdate, NewCreditCardPurchase } from '@db/schema';

import { CrudService } from './crud.service';

class CreditCardPurchasesService extends CrudService<CreditCardPurchase, NewCreditCardPurchase, CreditCardPurchaseUpdate> {
  constructor() {
    super(window.fortuna.creditCardPurchases);
  }
}

export const creditCardPurchasesService = new CreditCardPurchasesService();
