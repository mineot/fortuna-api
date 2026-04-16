import { format } from 'date-fns';

import { getCurrencySymbol, getDateLocale, i18n } from '../i18n';

export type FormatterValue = string | number | Date | boolean;

type TextOptions = {
  prefix?: string;
  suffix?: string;
};

function formatText(value: string, options: TextOptions = {}): string {
  const { prefix, suffix } = options;
  return [prefix ?? '', value, suffix ?? ''].join('').trim();
}

function formatInteger(value: number): string {
  return String(value);
}

function formatDecimal(value: number): string {
  const formatter = new Intl.NumberFormat(i18n.language, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

function formatCurrency(value: number): string {
  const formatter = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: getCurrencySymbol(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

function formatTime(value: Date): string {
  return format(value, 'HH:mm:ss', { locale: getDateLocale() });
}

function formatDate(value: Date): string {
  return format(value, 'dd/MM/yyyy', { locale: getDateLocale() });
}

function formatDateTime(value: Date): string {
  return format(value, 'dd/MM/yyyy HH:mm:ss', { locale: getDateLocale() });
}

function formatBool(value: boolean): string {
  return value ? '✅' : '❌';
}

export const Formatter = {
  text: formatText,
  int: formatInteger,
  decimal: formatDecimal,
  currency: formatCurrency,
  time: formatTime,
  date: formatDate,
  datetime: formatDateTime,
  bool: formatBool,
};
