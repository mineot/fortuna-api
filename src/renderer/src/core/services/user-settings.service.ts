import type { NewUserSettings, UserSettings, UserSettingsUpdate } from '@db/schema';

import { CrudService } from './crud.service';

class UserSettingsService extends CrudService<UserSettings, NewUserSettings, UserSettingsUpdate> {
  constructor() {
    super(window.fortuna.userSettings);
  }
}

export const userSettingsService = new UserSettingsService();
