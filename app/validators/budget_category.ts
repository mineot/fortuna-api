import vine from '@vinejs/vine';

const amount = () => vine.number().min(-999999999999.99).max(999999999999.99);

export const createBudgetCategoryValidator = vine.create({
  budgetId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive(),
  plannedAmount: amount(),
  carryoverAmount: amount().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateBudgetCategoryValidator = vine.create({
  budgetId: vine.number().withoutDecimals().positive(),
  categoryId: vine.number().withoutDecimals().positive(),
  plannedAmount: amount(),
  carryoverAmount: amount(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
