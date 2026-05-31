import vine from '@vinejs/vine';

const budgetStatus = () => vine.enum(['active', 'closed'] as const);

export const createBudgetValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  periodStart: vine.string().trim(),
  periodEnd: vine.string().trim(),
  status: budgetStatus().optional(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updateBudgetValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  periodStart: vine.string().trim(),
  periodEnd: vine.string().trim(),
  status: budgetStatus(),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
