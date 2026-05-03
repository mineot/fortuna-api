import type { Account, AccountUpdate, NewAccount } from '@db/schema';

import { CrudService } from './crud.service';

class AccountsService extends CrudService<Account, NewAccount, AccountUpdate> {
  constructor() {
    super(window.fortuna.accounts);
  }
}

export const accountsService = new AccountsService();
