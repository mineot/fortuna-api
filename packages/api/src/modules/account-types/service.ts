import type {
  AccountTypeUpdate,
  AccountTypeResponse,
  CreateAccountTypeDto,
  UpdateAccountTypeDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import type { ApiRepositories } from '../../lib/repositories.js';

const normalizeAccountTypeName = (name: string): string => name.trim().toLowerCase();

export const createAccountTypesService = (repositories: ApiRepositories) => ({
  create: async (payload: CreateAccountTypeDto): Promise<AccountTypeResponse> => {
    const existingTypes = await repositories.accountTypes.list();

    if (
      existingTypes.some((type) => normalizeAccountTypeName(type.name) === normalizeAccountTypeName(payload.name))
    ) {
      throw new DomainError(409, {
        code: 'ACCOUNT_TYPE_CONFLICT',
        message: 'Account type already exists.',
      });
    }

    return repositories.accountTypes.create(payload);
  },

  findById: async (id: number): Promise<AccountTypeResponse> => {
    const accountType = await repositories.accountTypes.findById(id);

    if (!accountType) {
      throw new DomainError(404, {
        code: 'ACCOUNT_TYPE_NOT_FOUND',
        message: 'Account type not found.',
      });
    }

    return accountType;
  },

  list: async (): Promise<AccountTypeResponse[]> => {
    return repositories.accountTypes.list();
  },

  updateById: async (id: number, payload: UpdateAccountTypeDto): Promise<AccountTypeResponse> => {
    const normalizedPayload = omitUndefined(payload) as AccountTypeUpdate;

    if (normalizedPayload.name) {
      const nextName = normalizedPayload.name;
      const existingTypes = await repositories.accountTypes.list();

      if (
        existingTypes.some(
          (type) =>
            type.id !== id && normalizeAccountTypeName(type.name) === normalizeAccountTypeName(nextName),
        )
      ) {
        throw new DomainError(409, {
          code: 'ACCOUNT_TYPE_CONFLICT',
          message: 'Account type already exists.',
        });
      }
    }

    const accountType = await repositories.accountTypes.updateById(id, normalizedPayload);

    if (!accountType) {
      throw new DomainError(404, {
        code: 'ACCOUNT_TYPE_NOT_FOUND',
        message: 'Account type not found.',
      });
    }

    return accountType;
  },

  deleteById: async (id: number): Promise<void> => {
    const deleted = await repositories.accountTypes.deleteById(id);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'ACCOUNT_TYPE_NOT_FOUND',
        message: 'Account type not found.',
      });
    }
  },
});

export type AccountTypesService = ReturnType<typeof createAccountTypesService>;
