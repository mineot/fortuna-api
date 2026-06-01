import vine from '@vinejs/vine';

const amount = () => vine.number().min(0).max(999999999999.99);

export const createShoppingListItemValidator = vine.create({
  shoppingListId: vine.number().withoutDecimals().positive(),
  name: vine.string().trim().minLength(1).maxLength(160),
  quantity: vine.number().positive().max(999999999.999).optional(),
  unit: vine.string().trim().maxLength(20).nullable().optional(),
  estimatedPrice: amount().nullable().optional(),
  checked: vine.boolean().optional(),
  position: vine.number().withoutDecimals().min(0).optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateShoppingListItemValidator = vine.create({
  shoppingListId: vine.number().withoutDecimals().positive(),
  name: vine.string().trim().minLength(1).maxLength(160),
  quantity: vine.number().positive().max(999999999.999),
  unit: vine.string().trim().maxLength(20).nullable().optional(),
  estimatedPrice: amount().nullable().optional(),
  checked: vine.boolean(),
  position: vine.number().withoutDecimals().min(0),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
