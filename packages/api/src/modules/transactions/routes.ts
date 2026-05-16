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
import { createTransactionsService } from './service.js';

const TRANSACTION_TYPES = ['income', 'expense'] as const;
const TRANSACTION_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

const transactionIdParamsSchema = z
  .object({ id: z.coerce.number().int().positive() })
  .strict();

const transactionListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    account_id: z.coerce.number().int().positive().optional(),
    category_id: z.coerce.number().int().positive().optional(),
    payee_id: z.coerce.number().int().positive().optional(),
    type: z.enum(TRANSACTION_TYPES).optional(),
    status: z.enum(TRANSACTION_STATUSES).optional(),
    date_from: z.string().trim().min(1).optional(),
    date_to: z.string().trim().min(1).optional(),
  })
  .strict();

const createTransactionBodySchema = z
  .object({
    account_id: z.number().int().positive(),
    category_id: z.number().int().positive(),
    payee_id: z.number().int().positive().nullable().optional(),
    type: z.enum(TRANSACTION_TYPES),
    description: z.string().trim().min(1),
    amount: z.number().int().positive(),
    date: z.string().trim().min(1),
    status: z.enum(TRANSACTION_STATUSES),
    notes: z.string().trim().min(1).nullable().optional(),
  })
  .strict();

const updateTransactionBodySchema = createTransactionBodySchema.partial().strict();

export const createTransactionsRoutes = (repositories: ApiRepositories) => {
  const transactionsService = createTransactionsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, transactionListQuerySchema);
      const response = await transactionsService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createTransactionBodySchema);
      const transaction = await transactionsService.create(userId, payload);

      return jsonSuccess(context, transaction, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, transactionIdParamsSchema);
      const transaction = await transactionsService.findById(userId, params.id);

      return jsonSuccess(context, transaction);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, transactionIdParamsSchema);
      const payload = await parseRequestBody(context, updateTransactionBodySchema);
      const transaction = await transactionsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, transaction);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, transactionIdParamsSchema);

      await transactionsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
