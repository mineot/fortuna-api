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
import { createAccountsService } from './service.js';

const accountIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const accountListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    account_type_id: z.coerce.number().int().positive().optional(),
  })
  .strict();

const createAccountBodySchema = z
  .object({
    account_type_id: z.number().int().positive(),
    name: z.string().trim().min(1),
    initial_balance: z.number().int(),
    notes: z.string().trim().min(1).nullable().optional(),
  })
  .strict();

const updateAccountBodySchema = createAccountBodySchema.partial().strict();

export const createAccountsRoutes = (repositories: ApiRepositories) => {
  const accountsService = createAccountsService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, accountListQuerySchema);
      const response = await accountsService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createAccountBodySchema);
      const account = await accountsService.create(userId, payload);

      return jsonSuccess(context, account, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, accountIdParamsSchema);
      const account = await accountsService.findById(userId, params.id);

      return jsonSuccess(context, account);
    })
    .get('/:id/current-balance', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, accountIdParamsSchema);
      const balance = await accountsService.getCurrentBalance(userId, params.id);

      return jsonSuccess(context, {
        account_id: params.id,
        current_balance: balance,
      });
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, accountIdParamsSchema);
      const payload = await parseRequestBody(context, updateAccountBodySchema);
      const account = await accountsService.updateById(userId, params.id, payload);

      return jsonSuccess(context, account);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, accountIdParamsSchema);

      await accountsService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
