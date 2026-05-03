import type { CreditCardInstallment, CreditCardInstallmentUpdate, NewCreditCardInstallment } from '@db/schema';

import { CrudService } from './crud.service';

class CreditCardInstallmentsService extends CrudService<CreditCardInstallment, NewCreditCardInstallment, CreditCardInstallmentUpdate> {
  constructor() {
    super(window.fortuna.creditCardInstallments);
  }
}

export const creditCardInstallmentsService = new CreditCardInstallmentsService();
