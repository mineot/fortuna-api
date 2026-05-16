import type { AccountTypeResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { AccountTypesPort } from '../ports.js';

export interface GetAccountTypeUseCaseDeps {
  accountTypes: AccountTypesPort;
}

export const createGetAccountTypeUseCase = (deps: GetAccountTypeUseCaseDeps) => {
  return async (id: number): Promise<AccountTypeResponse> => {
    const accountType = await deps.accountTypes.findById(id);

    if (!accountType) {
      throw new DomainError({
        code: 'ACCOUNT_TYPE_NOT_FOUND',
        message: 'Account type not found.',
      });
    }

    return accountType;
  };
};
