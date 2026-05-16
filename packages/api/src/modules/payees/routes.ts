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
import { createPayeesService } from './service.js';

const payeeIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const payeeListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().min(1).optional(),
  })
  .strict();

const createPayeeBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .strict();

const updatePayeeBodySchema = createPayeeBodySchema.partial().strict();

export const createPayeesRoutes = (repositories: ApiRepositories) => {
  const payeesService = createPayeesService(repositories);
  const router = new Hono<{ Variables: ApiVariables }>();

  router.use('*', authUserMiddleware);

  return router
    .get('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const query = parseRequestQuery(context, payeeListQuerySchema);
      const response = await payeesService.listByUser(userId, query);

      return jsonPaginated(context, response);
    })
    .post('/', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const payload = await parseRequestBody(context, createPayeeBodySchema);
      const payee = await payeesService.create(userId, payload);

      return jsonSuccess(context, payee, 201);
    })
    .get('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, payeeIdParamsSchema);
      const payee = await payeesService.findById(userId, params.id);

      return jsonSuccess(context, payee);
    })
    .patch('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, payeeIdParamsSchema);
      const payload = await parseRequestBody(context, updatePayeeBodySchema);
      const payee = await payeesService.updateById(userId, params.id, payload);

      return jsonSuccess(context, payee);
    })
    .delete('/:id', async (context) => {
      const userId = getAuthenticatedUserId(context);
      const params = parseRequestParams(context, payeeIdParamsSchema);

      await payeesService.deleteById(userId, params.id);

      return jsonSuccess(context, { deleted: true });
    });
};
