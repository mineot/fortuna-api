import type {
  CreditCardStatementPayment,
  CreditCardStatementPaymentUpdate,
  NewCreditCardStatementPayment,
} from '@db/schema';

import { CrudService } from './crud.service';

class CreditCardStatementPaymentsService extends CrudService<
  CreditCardStatementPayment,
  NewCreditCardStatementPayment,
  CreditCardStatementPaymentUpdate
> {
  constructor() {
    super(window.fortuna.creditCardStatementPayments);
  }
}

export const creditCardStatementPaymentsService = new CreditCardStatementPaymentsService();
