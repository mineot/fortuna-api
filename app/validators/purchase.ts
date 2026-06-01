import vine from '@vinejs/vine';
import { PURCHASE_STATUSES } from '#services/domain_enums';

const amount = () => vine.number().min(0).max(999999999999.99);
const status = () => vine.enum(PURCHASE_STATUSES);

export const createPurchaseValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive().nullable().optional(),
  shoppingListId: vine.number().withoutDecimals().positive().nullable().optional(),
  title: vine.string().trim().minLength(2).maxLength(160),
  purchaseDate: vine.string().trim(),
  totalAmount: amount(),
  status: status().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updatePurchaseValidator = vine.create({
  accountId: vine.number().withoutDecimals().positive().nullable().optional(),
  shoppingListId: vine.number().withoutDecimals().positive().nullable().optional(),
  title: vine.string().trim().minLength(2).maxLength(160),
  purchaseDate: vine.string().trim(),
  totalAmount: amount(),
  status: status(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
