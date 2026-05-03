import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { USER_SETTINGS_CHANNELS } from './user-settings.types';

export function registerUserSettingsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'user_settings', USER_SETTINGS_CHANNELS);
}
