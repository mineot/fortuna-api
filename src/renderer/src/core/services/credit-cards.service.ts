import type { CreditCard, CreditCardUpdate, NewCreditCard } from '@db/schema';

import { CrudService } from './crud.service';

class CreditCardsService extends CrudService<CreditCard, NewCreditCard, CreditCardUpdate> {
  constructor() {
    super(window.fortuna.creditCards);
  }
}

export const creditCardsService = new CreditCardsService();
