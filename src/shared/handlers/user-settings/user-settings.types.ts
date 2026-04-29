import type { UserSettingsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const USER_SETTINGS_CHANNELS = {
  list: 'user-settings:list',
  listAll: 'user-settings:list-all',
  findOne: 'user-settings:find-one',
  add: 'user-settings:add',
  change: 'user-settings:change',
  remove: 'user-settings:remove',
} as const;

export type UserSettingsRow = Selectable<UserSettingsTable>;
export type UserSettingsAddInput = Insertable<UserSettingsTable>;
export type UserSettingsChangeInput = { id: number; changes: Updateable<UserSettingsTable> };
