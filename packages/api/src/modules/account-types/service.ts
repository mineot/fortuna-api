import type { AccountTypeResponse, CreateAccountTypeDto, UpdateAccountTypeDto } from '@repo/shared';
import {
  createCreateAccountTypeUseCase,
  createDeleteAccountTypeUseCase,
  createGetAccountTypeUseCase,
  createListAccountTypesUseCase,
  createUpdateAccountTypeUseCase,
} from '@repo/domain';

import { omitUndefined } from '../../lib/object.js';
import { mapDomainError } from '../../lib/domain-error.mapper.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export const createAccountTypesService = (repositories: ApiRepositories) => {
  const accountTypesPort = {
    ...repositories.accountTypes,
    updateById: (id: number, input: Partial<{ name: string }>) =>
      repositories.accountTypes.updateById(id, omitUndefined(input)),
  };

  const createAccountTypeUseCase = createCreateAccountTypeUseCase({
    accountTypes: accountTypesPort,
  });
  const getAccountTypeUseCase = createGetAccountTypeUseCase({
    accountTypes: accountTypesPort,
  });
  const listAccountTypesUseCase = createListAccountTypesUseCase({
    accountTypes: accountTypesPort,
  });
  const updateAccountTypeUseCase = createUpdateAccountTypeUseCase({
    accountTypes: accountTypesPort,
  });
  const deleteAccountTypeUseCase = createDeleteAccountTypeUseCase({
    accountTypes: accountTypesPort,
  });

  return {
    create: async (payload: CreateAccountTypeDto): Promise<AccountTypeResponse> => {
      try {
        return await createAccountTypeUseCase(payload);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    findById: async (id: number): Promise<AccountTypeResponse> => {
      try {
        return await getAccountTypeUseCase(id);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    list: async (): Promise<AccountTypeResponse[]> => {
      return listAccountTypesUseCase();
    },

    updateById: async (id: number, payload: UpdateAccountTypeDto): Promise<AccountTypeResponse> => {
      try {
        return await updateAccountTypeUseCase(id, omitUndefined(payload));
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (id: number): Promise<void> => {
      try {
        await deleteAccountTypeUseCase(id);
      } catch (error) {
        mapDomainError(error);
      }
    },
  };
};

export type AccountTypesService = ReturnType<typeof createAccountTypesService>;
