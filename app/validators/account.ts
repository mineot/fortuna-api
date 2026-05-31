import vine from '@vinejs/vine';

const money = () => vine.number().min(-999999999999.99).max(999999999999.99);

export const createAccountValidator = vine.create({
  accountTypeId: vine.number().withoutDecimals().positive(),
  name: vine.string().trim().minLength(2).maxLength(120),
  initialBalance: money().optional(),
  currentBalance: money().optional(),
  currency: vine.string().trim().fixedLength(3),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateAccountValidator = vine.create({
  accountTypeId: vine.number().withoutDecimals().positive(),
  name: vine.string().trim().minLength(2).maxLength(120),
  initialBalance: money(),
  currentBalance: money(),
  currency: vine.string().trim().fixedLength(3),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
