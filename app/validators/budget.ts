import vine from '@vinejs/vine';
import { BUDGET_STATUSES } from '#services/domain_enums';

const budgetStatus = () => vine.enum(BUDGET_STATUSES);

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
