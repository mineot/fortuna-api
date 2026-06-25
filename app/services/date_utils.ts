import { DateTime } from 'luxon';

export function parseDateISO(value: string, timezone: string = 'UTC'): DateTime {
  return DateTime.fromISO(value, { zone: timezone });
}

export function parseOptionalDateISO(
  value: string | null | undefined,
  timezone: string,
): DateTime | null {
  if (!value) return null;
  return DateTime.fromISO(value, { zone: timezone });
}
