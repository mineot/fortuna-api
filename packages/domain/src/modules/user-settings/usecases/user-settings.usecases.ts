import type { UserSettingsResponse, UserSettingsUpdate } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { UserSettingsPort, UserSettingsUpsertInput } from '../ports.js';

export const createUserSettingsUseCases = (userSettings: UserSettingsPort) => ({
  findByUserId: async (userId: number): Promise<UserSettingsResponse> => {
    const settings = await userSettings.findByUserId(userId);
    if (!settings) throw new DomainError({ code: 'USER_SETTINGS_NOT_FOUND', message: 'User settings not found.' });
    return settings;
  },
  upsertByUserId: (userId: number, payload: UserSettingsUpsertInput): Promise<UserSettingsResponse> =>
    userSettings.upsertByUserId(userId, payload),
  updateByUserId: async (userId: number, payload: UserSettingsUpdate): Promise<UserSettingsResponse> => {
    const settings = await userSettings.updateByUserId(userId, payload);
    if (!settings) throw new DomainError({ code: 'USER_SETTINGS_NOT_FOUND', message: 'User settings not found.' });
    return settings;
  },
});
