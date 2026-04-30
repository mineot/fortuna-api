import type { NewUserSettings, UserSettings,UserSettingsUpdate } from '@db/schema';

class UserSettingsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.userSettings.list(input);
  }

  listAll(): Promise<UserSettings[]> {
    return window.fortuna.userSettings.listAll() as Promise<UserSettings[]>;
  }

  findOne(id: number): Promise<UserSettings | undefined> {
    return window.fortuna.userSettings.findOne(id) as Promise<UserSettings | undefined>;
  }

  add(input: NewUserSettings): Promise<UserSettings> {
    return window.fortuna.userSettings.add(input) as Promise<UserSettings>;
  }

  change(input: { id: number; changes: Partial<UserSettingsUpdate> }): Promise<UserSettings | undefined> {
    return window.fortuna.userSettings.change(input) as Promise<UserSettings | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.userSettings.remove(id) as Promise<boolean>;
  }
}

export const userSettingsService = new UserSettingsService();
