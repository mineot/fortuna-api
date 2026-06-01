import vine from '@vinejs/vine';
import { SHOPPING_LIST_STATUSES } from '#services/domain_enums';

const status = () => vine.enum(SHOPPING_LIST_STATUSES);

export const createShoppingListValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(140),
  status: status().optional(),
  targetDate: vine.string().trim().nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateShoppingListValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(140),
  status: status(),
  targetDate: vine.string().trim().nullable().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
