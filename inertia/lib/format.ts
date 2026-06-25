import { DateTime } from 'luxon';
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';

type DateLike = string | DateTime | Date;

function toDateTime(value: DateLike): DateTime {
  if (DateTime.isDateTime(value)) return value;
  if (value instanceof Date) return DateTime.fromJSDate(value);
  return DateTime.fromISO(value);
}

export function useFormat() {
  const page = usePage<Data.SharedProps>();

  const locale = computed(() => page.props.locale ?? 'en-US');
  const timezone = computed(() => page.props.timezone ?? 'UTC');

  function formatDate(value: DateLike, format?: Intl.DateTimeFormatOptions) {
    return toDateTime(value)
      .setLocale(locale.value)
      .toLocaleString(format ?? DateTime.DATE_SHORT);
  }

  function formatDateTime(value: DateLike, format?: Intl.DateTimeFormatOptions) {
    return toDateTime(value)
      .setLocale(locale.value)
      .setZone(timezone.value)
      .toLocaleString(format ?? DateTime.DATETIME_SHORT);
  }

  function formatRelative(value: DateLike) {
    return toDateTime(value).setZone(timezone.value).toRelative({ locale: locale.value });
  }

  function formatRelativeCalendar(value: DateLike) {
    const dt = toDateTime(value).setZone(timezone.value);
    const now = DateTime.now().setZone(timezone.value);

    if (dt.hasSame(now, 'day')) {
      return dt.setLocale(locale.value).toLocaleString(DateTime.TIME_SIMPLE);
    }

    if (dt.hasSame(now, 'year')) {
      return dt.setLocale(locale.value).toLocaleString({ month: 'short', day: 'numeric' });
    }

    return dt.setLocale(locale.value).toLocaleString(DateTime.DATE_SHORT);
  }

  return { locale, timezone, formatDate, formatDateTime, formatRelative, formatRelativeCalendar };
}
