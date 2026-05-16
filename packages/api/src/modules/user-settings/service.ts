import type {
  CreateUserSettingsDto,
  UpdateUserSettingsDto,
  UserSettingsUpdate,
  UserSettingsResponse,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import type { ApiRepositories } from '../../lib/repositories.js';

type UserSettingsUpsertPayload = Omit<CreateUserSettingsDto, 'user_id'>;

type UserSettingsPatchPayload = Omit<UpdateUserSettingsDto, 'user_id'>;

export const createUserSettingsService = (repositories: ApiRepositories) => ({
  findByUserId: async (userId: number): Promise<UserSettingsResponse> => {
    const settings = await repositories.userSettings.findByUserId(userId);

    if (!settings) {
      throw new DomainError(404, {
        code: 'USER_SETTINGS_NOT_FOUND',
        message: 'User settings not found.',
      });
    }

    return settings;
  },

  upsertByUserId: async (
    userId: number,
    payload: UserSettingsUpsertPayload,
  ): Promise<UserSettingsResponse> => {
    return repositories.userSettings.upsertByUserId(userId, payload);
  },

  updateByUserId: async (
    userId: number,
    payload: UserSettingsPatchPayload,
  ): Promise<UserSettingsResponse> => {
    const settings = await repositories.userSettings.updateByUserId(
      userId,
      omitUndefined(payload) as UserSettingsUpdate,
    );

    if (!settings) {
      throw new DomainError(404, {
        code: 'USER_SETTINGS_NOT_FOUND',
        message: 'User settings not found.',
      });
    }

    return settings;
  },
});

export type UserSettingsService = ReturnType<typeof createUserSettingsService>;
