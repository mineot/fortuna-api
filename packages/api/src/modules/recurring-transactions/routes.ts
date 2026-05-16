import { Hono } from 'hono';
import { z } from 'zod';

import { getAuthenticatedUserId, type ApiVariables } from '../../lib/http-context.js';
import { jsonPaginated, jsonSuccess } from '../../lib/response.js';
import type { ApiRepositories } from '../../lib/repositories.js';
import { authUserMiddleware } from '../../middlewares/auth-user.middleware.js';
import {
  parseRequestBody,
  parseRequestParams,
  parseRequestQuery,
} from '../../validators/common.validators.js';
import { createRecurringTransactionsService } from './service.js';

const TRANSACTION_TYPES = ['income', 'expense'] as const;
const RECURRENCE_TYPES = ['subscription', 'fixed_bill', 'fixed_income', 'monthly_fee', 'other'] as const;
const RECURRENCE_FREQUENCIES = ['monthly', 'yearly', 'weekly', 'biweekly', 'custom'] as const;

const recurringTransactionIdParamsSchema = z
  .object({ id: z.coerce.number().int().positive() })
  .strict();

const recurringTransactionListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    active: z.union([z.literal('0'), z.literal('1')]).transform((value) => Number(value) as 0 | 1).optional(),
    account_id: z.coerce.number().int().positive().optional(),
    category_id: z.coerce.number().int().positive().optional(),
    payee_id: z.coerce.number().int().positive().optional(),
    type: z.enum(TRANSACTION_TYPES).optional(),
    recurrence_type: z.enum(RECURRENCE_TYPES).optional(),
    frequency: z.enum(RECURRENCE_FREQUENCIES).optional(),
    due_day: z.coerce.number().int().min(1).max(31).optional(),
  })
  .strict();

const createRecurringTransactionBodySchema = z
  .object({
    account_id: z.number().int().positive(),
    category_id: z.number().int().positive(),
    payee_id: z.number().int().positive().nullable().optional(),
    name: z.string().trim().min(1),
    description: z.string().trim().min(1).nullable().optional(),
    type: z.enum(TRANSACTION_TYPES),
    recurrence_type: z.enum(RECURRENCE_TYPES),
    amount: z.number().int().positive(),
    frequency: z.enum(RECURRENCE_FREQUENCIES),
    due_day: z.number().int().min(1).max(31),
    start_date: z.string().trim().min(1),
    end_date: z.string().trim().min(1).nullable().optional(),
    active: z.union([z.literal(0), z.literal(1)]),
  })
  .strict();

const updateRecurringTransactionBodySchema = createRecurringTransactionBodySchema.partial().strict();

export const createRecurringTransactionsRoutes = (repositories: ApiRepositories) => {
  const recurringTransactionsService = createRecurringTransactionsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, recurringTransactionListQuerySchema);
      const response = await recurringTransactionsService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createRecurringTransactionBodySchema);
      const recurringTransaction = await recurringTransactionsService.create(userId, payload);

      return jsonSuccess(context, recurringTransaction, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, recurringTransactionIdParamsSchema);
      const recurringTransaction = await recurringTransactionsService.findById(userId, params.id);

      return jsonSuccess(context, recurringTransaction);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, recurringTransactionIdParamsSchema);
      const payload = await parseRequestBody(context, updateRecurringTransactionBodySchema);
      const recurringTransaction = await recurringTransactionsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, recurringTransaction);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, recurringTransactionIdParamsSchema);

      await recurringTransactionsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
