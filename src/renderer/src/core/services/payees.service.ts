import type { NewPayee, Payee, PayeeUpdate } from '@db/schema';

import { CrudService } from './crud.service';

class PayeesService extends CrudService<Payee, NewPayee, PayeeUpdate> {
  constructor() {
    super(window.fortuna.payees);
  }
}

export const payeesService = new PayeesService();
