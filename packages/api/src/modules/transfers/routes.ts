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
import { createTransfersService } from './service.js';

const TRANSACTION_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

const transferIdParamsSchema = z
  .object({ id: z.coerce.number().int().positive() })
  .strict();

const transferListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    source_account_id: z.coerce.number().int().positive().optional(),
    destination_account_id: z.coerce.number().int().positive().optional(),
    status: z.enum(TRANSACTION_STATUSES).optional(),
    date_from: z.string().trim().min(1).optional(),
    date_to: z.string().trim().min(1).optional(),
  })
  .strict();

const createTransferBodySchema = z
  .object({
    source_account_id: z.number().int().positive(),
    destination_account_id: z.number().int().positive(),
    amount: z.number().int().positive(),
    date: z.string().trim().min(1),
    description: z.string().trim().min(1).nullable().optional(),
    status: z.enum(TRANSACTION_STATUSES),
  })
  .strict();

const updateTransferBodySchema = createTransferBodySchema.partial().strict();

export const createTransfersRoutes = (repositories: ApiRepositories) => {
  const transfersService = createTransfersService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, transferListQuerySchema);
      const response = await transfersService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createTransferBodySchema);
      const transfer = await transfersService.create(userId, payload);

      return jsonSuccess(context, transfer, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, transferIdParamsSchema);
      const transfer = await transfersService.findById(userId, params.id);

      return jsonSuccess(context, transfer);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, transferIdParamsSchema);
      const payload = await parseRequestBody(context, updateTransferBodySchema);
      const transfer = await transfersService.updateById(userId, params.id, payload);

      return jsonSuccess(context, transfer);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, transferIdParamsSchema);

      await transfersService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
