import type { AccountType, AccountTypeUpdate, NewAccountType } from '@db/schema';

import { CrudService } from './crud.service';

class AccountTypesService extends CrudService<AccountType, NewAccountType, AccountTypeUpdate> {
  constructor() {
    super(window.fortuna.accountTypes);
  }
}

export const accountTypesService = new AccountTypesService();
