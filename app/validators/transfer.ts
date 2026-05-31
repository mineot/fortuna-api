import vine from '@vinejs/vine';

const amount = () => vine.number().positive().max(999999999999.99);
const transferStatus = () => vine.enum(['posted', 'pending'] as const);

export const createTransferValidator = vine.create({
  fromAccountId: vine.number().withoutDecimals().positive(),
  toAccountId: vine.number().withoutDecimals().positive(),
  amount: amount(),
  transferDate: vine.string().trim(),
  status: transferStatus().optional(),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
