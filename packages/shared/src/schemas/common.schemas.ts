import { z } from 'zod';

const ISO_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const ISO_DATETIME_WITH_OFFSET_REGEX =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-][01]\d:[0-5]\d)$/;

const isValidIsoDate = (value: string): boolean => {
  if (!ISO_DATE_REGEX.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() + 1 === month &&
    utcDate.getUTCDate() === day
  );
};

const isValidIsoDateTimeWithOffset = (value: string): boolean => {
  if (!ISO_DATETIME_WITH_OFFSET_REGEX.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

export const idSchema = z.int().positive();
export const moneyCentsSchema = z.int();
export const positiveMoneyCentsSchema = z.int().positive();
export const isoDateSchema = z
  .string()
  .refine(isValidIsoDate, 'Invalid ISO date (YYYY-MM-DD)');
export const isoDateTimeSchema = z
  .string()
  .refine(
    isValidIsoDateTimeWithOffset,
    'Invalid ISO datetime (YYYY-MM-DDTHH:mm:ss(.sss)Z or ±HH:mm)',
  );
export const optionalNoteSchema = z.string().trim().min(1).nullable();
export const booleanIntSchema = z.union([z.literal(0), z.literal(1)]);

const pageSizeSchema = z.int().positive().max(100);

export const paginationSchema = z.object({
  page: z.int().positive().default(1),
  page_size: pageSizeSchema.default(20),
}).strict();
