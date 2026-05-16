import type { AccountTypeResponse, UpdateAccountTypeDto } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import { normalizeAccountTypeName } from '../services/normalize-account-type-name.service.js';
import type { AccountTypesPort } from '../ports.js';

export interface UpdateAccountTypeUseCaseDeps {
  accountTypes: AccountTypesPort;
}

export const createUpdateAccountTypeUseCase = (deps: UpdateAccountTypeUseCaseDeps) => {
  return async (id: number, payload: UpdateAccountTypeDto): Promise<AccountTypeResponse> => {
    if (payload.name) {
      const existingTypes = await deps.accountTypes.list();

      if (
        existingTypes.some(
          (type) =>
            type.id !== id &&
            normalizeAccountTypeName(type.name) === normalizeAccountTypeName(payload.name as string),
        )
      ) {
        throw new DomainError({
          code: 'ACCOUNT_TYPE_CONFLICT',
          message: 'Account type already exists.',
        });
      }
    }

    const accountType = await deps.accountTypes.updateById(id, payload);

    if (!accountType) {
      throw new DomainError({
        code: 'ACCOUNT_TYPE_NOT_FOUND',
        message: 'Account type not found.',
      });
    }

    return accountType;
  };
};
