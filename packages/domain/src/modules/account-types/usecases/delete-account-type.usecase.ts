import { DomainError } from '../../../errors/domain-error.js';
import type { AccountTypesPort } from '../ports.js';

export interface DeleteAccountTypeUseCaseDeps {
  accountTypes: AccountTypesPort;
}

export const createDeleteAccountTypeUseCase = (deps: DeleteAccountTypeUseCaseDeps) => {
  return async (id: number): Promise<void> => {
    const deleted = await deps.accountTypes.deleteById(id);

    if (!deleted) {
      throw new DomainError({
        code: 'ACCOUNT_TYPE_NOT_FOUND',
        message: 'Account type not found.',
      });
    }
  };
};
