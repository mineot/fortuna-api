import vine from '@vinejs/vine';

const amount = () => vine.number().min(0).max(999999999999.99);
const status = () => vine.enum(['active', 'blocked', 'closed'] as const);

export const createCreditCardValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive().nullable().optional(),
  name: vine.string().trim().minLength(2).maxLength(120),
  brand: vine.string().trim().maxLength(40).nullable().optional(),
  lastFourDigits: vine.string().trim().fixedLength(4).nullable().optional(),
  creditLimit: amount(),
  closingDay: vine.number().withoutDecimals().min(1).max(31),
  dueDay: vine.number().withoutDecimals().min(1).max(31),
  status: status().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateCreditCardValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive().nullable().optional(),
  name: vine.string().trim().minLength(2).maxLength(120),
  brand: vine.string().trim().maxLength(40).nullable().optional(),
  lastFourDigits: vine.string().trim().fixedLength(4).nullable().optional(),
  creditLimit: amount(),
  closingDay: vine.number().withoutDecimals().min(1).max(31),
  dueDay: vine.number().withoutDecimals().min(1).max(31),
  status: status(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
