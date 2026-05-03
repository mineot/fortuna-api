import type { CreditCardStatement, CreditCardStatementUpdate, NewCreditCardStatement } from '@db/schema';

import { CrudService } from './crud.service';

class CreditCardStatementsService extends CrudService<CreditCardStatement, NewCreditCardStatement, CreditCardStatementUpdate> {
  constructor() {
    super(window.fortuna.creditCardStatements);
  }
}

export const creditCardStatementsService = new CreditCardStatementsService();
