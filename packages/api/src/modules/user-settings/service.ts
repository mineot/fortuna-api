import type {
  CreateUserSettingsDto,
  UpdateUserSettingsDto,
  UserSettingsUpdate,
  UserSettingsResponse,
} from '@repo/shared';
import { createUserSettingsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import type { ApiRepositories } from '../../lib/repositories.js';

type UserSettingsUpsertPayload = Omit<CreateUserSettingsDto, 'user_id'>;
type UserSettingsPatchPayload = Omit<UpdateUserSettingsDto, 'user_id'>;

export const createUserSettingsService = (repositories: ApiRepositories) => {
  const useCases = createUserSettingsUseCases(repositories.userSettings);

  return {
    findByUserId: async (userId: number): Promise<UserSettingsResponse> => {
      try {
        return await useCases.findByUserId(userId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    upsertByUserId: async (userId: number, payload: UserSettingsUpsertPayload): Promise<UserSettingsResponse> => {
      return useCases.upsertByUserId(userId, payload);
    },

    updateByUserId: async (userId: number, payload: UserSettingsPatchPayload): Promise<UserSettingsResponse> => {
      try {
        return await useCases.updateByUserId(userId, omitUndefined(payload) as UserSettingsUpdate);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};

export type UserSettingsService = ReturnType<typeof createUserSettingsService>;
