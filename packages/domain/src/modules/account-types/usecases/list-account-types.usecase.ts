import type { AccountTypeResponse } from '@repo/shared';

import type { AccountTypesPort } from '../ports.js';

export interface ListAccountTypesUseCaseDeps {
  accountTypes: AccountTypesPort;
}

export const createListAccountTypesUseCase = (deps: ListAccountTypesUseCaseDeps) => {
  return async (): Promise<AccountTypeResponse[]> => deps.accountTypes.list();
};
