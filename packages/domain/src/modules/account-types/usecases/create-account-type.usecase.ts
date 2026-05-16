import type { AccountTypeResponse, CreateAccountTypeDto } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import { normalizeAccountTypeName } from '../services/normalize-account-type-name.service.js';
import type { AccountTypesPort } from '../ports.js';

export interface CreateAccountTypeUseCaseDeps {
  accountTypes: AccountTypesPort;
}

export const createCreateAccountTypeUseCase = (deps: CreateAccountTypeUseCaseDeps) => {
  return async (payload: CreateAccountTypeDto): Promise<AccountTypeResponse> => {
    const existingTypes = await deps.accountTypes.list();

    if (
      existingTypes.some(
        (type) => normalizeAccountTypeName(type.name) === normalizeAccountTypeName(payload.name),
      )
    ) {
      throw new DomainError({
        code: 'ACCOUNT_TYPE_CONFLICT',
        message: 'Account type already exists.',
      });
    }

    return deps.accountTypes.create(payload);
  };
};
