import type { NewUserSettings, UserSettingsResponse, UserSettingsUpdate } from '@repo/shared';

export interface UserSettingsUpsertInput {
  locale: string;
  currency: string;
  fiscal_year_cutoff_day: number;
  fiscal_year_cutoff_month: number;
}

export interface UserSettingsPort {
  findByUserId(userId: number): Promise<UserSettingsResponse | undefined>;
  upsertByUserId(userId: number, payload: UserSettingsUpsertInput): Promise<UserSettingsResponse>;
  updateByUserId(userId: number, payload: UserSettingsUpdate): Promise<UserSettingsResponse | undefined>;
}
