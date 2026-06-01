import vine from '@vinejs/vine';

const amount = () => vine.number().min(0).max(999999999999.99);

export const createPurchaseItemValidator = vine.create({
  purchaseId: vine.number().withoutDecimals().positive(),
  shoppingListItemId: vine.number().withoutDecimals().positive().nullable().optional(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  name: vine.string().trim().minLength(1).maxLength(160),
  quantity: vine.number().positive().max(999999999.999).optional(),
  unitPrice: amount().optional(),
  totalPrice: amount().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updatePurchaseItemValidator = vine.create({
  purchaseId: vine.number().withoutDecimals().positive(),
  shoppingListItemId: vine.number().withoutDecimals().positive().nullable().optional(),
  categoryId: vine.number().withoutDecimals().positive().nullable().optional(),
  payeeId: vine.number().withoutDecimals().positive().nullable().optional(),
  name: vine.string().trim().minLength(1).maxLength(160),
  quantity: vine.number().positive().max(999999999.999),
  unitPrice: amount(),
  totalPrice: amount(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
